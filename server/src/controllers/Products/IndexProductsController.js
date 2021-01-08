const { products } = require('../../products.json');

class IndexProductsController {
    constructor(redisClientService) {
        this.redisClientService = redisClientService;
    }

    async index(req, res) {
        const productKeys = await this.redisClientService.eachScan('product:*');

        if (!productKeys.length) {
            for (const product of products) {
                const { id } = product;

                await this.redisClientService.jsonSet(`product:${id}`, '.', JSON.stringify(product));

                productKeys.push(`product:${id}`);
            }
        }

        let productList = [];

        for (const key of productKeys) {
            const product = await this.redisClientService.jsonGet(key);

            productList.push(JSON.parse(product));
        }

        return res.send(productList);
    }
}

module.exports = IndexProductsController;
