const express = require('express');
const redis = require('redis');
const rejson = require('redis-rejson');
const session = require('express-session');
const RedisStore = require('connect-redis')(session);
const path = require('path');
const crypto = require('crypto');
const bodyParser = require('body-parser');
const cors = require('cors');
const { StatusCodes } = require('http-status-codes');
const { promisify } = require('util');
const { products } = require('./products.json');

rejson(redis);

require('dotenv').config();

const {
    NODE_ENV,
    REDIS_ENDPOINT_URI,
    REDIS_HOST,
    REDIS_PORT,
    REDIS_PASSWORD,
    PORT,
    DATA_RESET_CODE,
    SESSION_SECRET,
    APP_FRONTEND_URL
} = process.env;

const app = express();

if (NODE_ENV !== 'production') {
    app.use(
        cors({
            origin(origin, callback) {
                if (origin === APP_FRONTEND_URL) {
                    callback(null, true);
                } else {
                    callback(new Error('Not allowed by CORS'));
                }
            },
            credentials: true
        })
    );
}

const redisEndpointUri = REDIS_ENDPOINT_URI
    ? REDIS_ENDPOINT_URI.replace(/^(redis\:\/\/)/, '')
    : `${REDIS_HOST}:${REDIS_PORT}`;

const redisClient = redis.createClient(`redis://${redisEndpointUri}`, {
    password: REDIS_PASSWORD
});

['json_get', 'json_set', 'hgetall', 'hset', 'hget', 'hdel', 'hincrby', 'scan'].forEach(
    method => (redisClient[method] = promisify(redisClient[method]))
);

app.use(
    session({
        store: new RedisStore({ client: redisClient }),
        secret: SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        rolling: true,
        cookie: {
            maxAge: 3600 * 1000 * 3
        }
    })
);

app.use(bodyParser.json());

const checkSession = (req, res, next) => {
    if (req.session && req.session.cartId) {
        return next();
    }

    req.session.cartId = crypto.randomBytes(16).toString('hex');

    return next();
};

app.use('/', express.static(path.join(__dirname, './public')));

app.get('/api/cart', [checkSession], async (req, res) => {
    const { cartId } = req.session;
    let productList = [];

    const cartList = await redisClient.hgetall(`cart:${cartId}`);

    if (!cartList) {
        return res.send([]);
    }

    for (const itemKey of Object.keys(cartList)) {
        const product = await redisClient.json_get(itemKey);

        productList.push({ product: JSON.parse(product), quantity: cartList[itemKey] });
    }

    return res.send(productList);
});

app.put('/api/cart/:id', [checkSession], async (req, res) => {
    const { cartId } = req.session;
    const { id: productId } = req.params;
    let { quantity, incrementBy } = req.body;

    quantity = parseInt(quantity);
    incrementBy = parseInt(incrementBy);

    let productInStore = await redisClient.json_get(`product:${productId}`);

    if (!productInStore) {
        return res.status(StatusCodes.BAD_REQUEST).send("Product with this id doesn't exist");
    }

    if (quantity === 0) {
        return res.status.send('Selecting 0 is not possible');
    }

    let quantityInCart = (await redisClient.hget(`cart:${cartId}`, `product:${productId}`)) || 0;

    quantityInCart = parseInt(quantityInCart);

    productInStore = JSON.parse(productInStore);
    const { stock } = productInStore;

    if (quantity > 0) {
        const newStock = stock - (quantity - quantityInCart);

        if (newStock >= 0) {
            await redisClient.hset(`cart:${cartId}`, `product:${productId}`, quantity);

            productInStore.stock = newStock;

            await redisClient.json_set(`product:${productId}`, '.', JSON.stringify(productInStore));

            return res.sendStatus(StatusCodes.OK);
        }

        return res.status(StatusCodes.BAD_REQUEST).send('Not enough products in stock');
    } else if (quantity < 0) {
        return res.status(StatusCodes.BAD_REQUEST).send('Quantity should be greater than 0');
    }

    if (incrementBy !== 0) {
        const quantityAfterIncrement = quantityInCart + incrementBy;

        if (quantityAfterIncrement <= 0 || stock - incrementBy < 0) {
            return res.status(StatusCodes.BAD_REQUEST).send("Can't increment above stock or decrement to 0");
        }

        if (stock - incrementBy >= 0) {
            await redisClient.hincrby(`cart:${cartId}`, `product:${productId}`, incrementBy);

            productInStore.stock -= incrementBy;

            await redisClient.json_set(`product:${productId}`, '.', JSON.stringify(productInStore));

            return res.sendStatus(StatusCodes.OK);
        }

        return res.status(StatusCodes.BAD_REQUEST).send('Not enough products in stock');
    } else if (incrementBy === 0) {
        return res.status(StatusCodes.BAD_REQUEST).send('Value of incrementBy should not be 0');
    }

    return res.status(StatusCodes.BAD_REQUEST).send('Please, provide quantity or incrementBy field');
});

app.delete('/api/cart/:id', [checkSession], async (req, res) => {
    const { cartId } = req.session;
    const { id: productId } = req.params;

    const quantityInCart = await redisClient.hget(`cart:${cartId}`, `product:${productId}`);

    if (quantityInCart >= 0) {
        await redisClient.hdel(`cart:${cartId}`, `product:${productId}`);

        let productInStore = await redisClient.json_get(`product:${productId}`);

        productInStore = JSON.parse(productInStore);
        productInStore.stock += quantityInCart;

        await redisClient.json_set(`product:${productId}`, '.', JSON.stringify(productInStore));
    }

    return res.sendStatus(StatusCodes.NO_CONTENT);
});

app.delete('/api/cart', [checkSession], async (req, res) => {
    const { cartId } = req.session;

    const cartList = await redisClient.hgetall(`cart:${cartId}`);

    for (const key of Object.keys(cartList)) {
        await redisClient.hdel(`cart:${cartId}`, key);

        let productInStore = await redisClient.json_get(key);

        productInStore = JSON.parse(productInStore);
        productInStore.stock += cartList[key];

        await redisClient.json_set(key, '.', JSON.stringify(productInStore));
    }

    return res.sendStatus(StatusCodes.NO_CONTENT);
});

app.get('/api/products', async (req, res) => {
    const { resetCode } = req.query;

    const [, cartKeys] = await redisClient.scan(0, 'MATCH', 'product:*');

    if (!resetCode && cartKeys.length) {
        const [, productKeys] = await redisClient.scan(0, 'MATCH', 'product:*');
        let productList = [];

        for (const key of productKeys) {
            const product = await redisClient.json_get(key);

            productList.push(JSON.parse(product));
        }

        return res.send(productList);
    }

    if (resetCode === DATA_RESET_CODE || !cartKeys.length) {
        for (const product of products) {
            const { id } = product;

            await redisClient.json_set(`product:${id}`, '.', JSON.stringify(product));
        }

        for (const key of cartKeys) {
            await redisClient.hdel(`product:${id}`, key);
        }

        return res.send(products);
    } else {
        return res.status(StatusCodes.BAD_REQUEST).send('Reset code is not valid');
    }
});

const port = PORT || 3000;

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});
