const { StatusCodes } = require('http-status-codes');
const { products } = require('../../products.json');

class ResetProductsController {
    constructor(redisClientService) {
        this.redisClientService = redisClientService;
    }

    async index(req, res) {
        const { resetCode } = req.query;

        const { DATA_RESET_CODE } = process.env;

        if (resetCode === DATA_RESET_CODE) {
            for (const product of products) {
                const { id } = product;

                await this.redisClientService.jsonSet(`product:${id}`, '.', JSON.stringify(product));
            }

            const cartKeys = await this.redisClientService.eachScan('cart:*');

            for (const key of cartKeys) {
                await this.redisClientService.redis.del(key);
            }

            return res.sendStatus(StatusCodes.OK);
        } else {
            return res.status(StatusCodes.BAD_REQUEST).send('Reset code is not valid');
        }
    }
}

module.exports = ResetProductsController;
