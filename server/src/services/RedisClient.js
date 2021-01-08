const { promisify } = require('util');

class RedisClient {
    constructor(redisClient) {
        ['json_get', 'json_set', 'hgetall', 'hset', 'hget', 'hdel', 'hincrby', 'del', 'scan'].forEach(
            method => (redisClient[method] = promisify(redisClient[method]))
        );
        this.redis = redisClient;
    }

    async scan(pattern) {
        let matchingKeysCount = 0;
        let keys = [];

        const recursiveScan = async (cursor = '0') => {
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

    async hgetall(key) {
        return await this.redis.hgetall(key);
    }

    async hset(hash, key, value) {
        return await this.redis.hset(hash, key, value);
    }

    async hget(hash, key) {
        return await this.redis.hget(hash, key);
    }

    async hdel(hash, key) {
        return await this.redis.hdel(hash, key);
    }

    async hincrby(hash, key, incr) {
        return await this.redis.hincrby(hash, key, incr);
    }

    async del(key) {
        return await this.redis.del(key);
    }
}

module.exports = RedisClient;
