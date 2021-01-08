const { promisify } = require('util');

class RedisClient {
    constructor(redisClient) {
        ['json_get', 'json_set', 'hgetall', 'hset', 'hget', 'hdel', 'hincrby', 'scan'].forEach(
            method => (redisClient[method] = promisify(redisClient[method]))
        );
        this.redis = redisClient;
    }

    async eachScan(pattern) {
        let matchingKeysCount = 0;
        let keys = [];

        const recursiveScan = async (cursor = 0) => {
            const [newCursor, matchingKeys] = await this.redis.scan(cursor, 'MATCH', pattern);
            cursor = newCursor;

            matchingKeysCount += matchingKeys.length;
            keys = keys.concat(matchingKeys);

            if (cursor === '0') {
                return keys;
            } else {
                return await recursiveScan(cursor);
            }
        };

        return await recursiveScan();
    }

    async jsonGet(key) {
        return await this.redis.json_get(key);
    }

    async jsonSet(key, path, json) {
        return await this.redis.json_set(key, path, json);
    }
}

module.exports = RedisClient;
