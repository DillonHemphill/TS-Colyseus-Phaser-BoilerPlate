"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const redis = require("redis");
const util_1 = require("util");
class RedisPresence {
    constructor(opts) {
        this.subscriptions = {};
        this.sub = redis.createClient(opts);
        this.pub = redis.createClient(opts);
        // create promisified redis methods.
        this.smembersAsync = util_1.promisify(this.pub.smembers).bind(this.pub);
        this.hgetAsync = util_1.promisify(this.pub.hget).bind(this.pub);
        this.hlenAsync = util_1.promisify(this.pub.hlen).bind(this.pub);
        this.pubsubAsync = util_1.promisify(this.pub.pubsub).bind(this.pub);
        this.incrAsync = util_1.promisify(this.pub.incr).bind(this.pub);
        this.decrAsync = util_1.promisify(this.pub.decr).bind(this.pub);
    }
    subscribe(topic, callback) {
        this.sub.subscribe(topic);
        this.subscriptions[topic] = (channel, message) => {
            if (channel === topic) {
                callback(JSON.parse(message));
            }
        };
        this.sub.addListener('message', this.subscriptions[topic]);
        return this;
    }
    unsubscribe(topic) {
        this.sub.removeListener('message', this.subscriptions[topic]);
        this.sub.unsubscribe(topic);
        delete this.subscriptions[topic];
        return this;
    }
    publish(topic, data) {
        if (data === undefined) {
            data = false;
        }
        this.pub.publish(topic, JSON.stringify(data));
    }
    exists(roomId) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.pubsubAsync('channels', roomId)).length > 0;
        });
    }
    setex(key, value, seconds) {
        this.pub.setex(key, seconds, value);
    }
    get(key) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                this.pub.get(key, (err, data) => {
                    if (err) {
                        return reject(err);
                    }
                    resolve(data);
                });
            });
        });
    }
    del(roomId) {
        this.pub.del(roomId);
    }
    sadd(key, value) {
        this.pub.sadd(key, value);
    }
    smembers(key) {
        return this.smembersAsync(key);
    }
    srem(key, value) {
        this.pub.srem(key, value);
    }
    scard(key) {
        return new Promise((resolve, reject) => {
            this.pub.scard(key, (err, data) => {
                if (err) {
                    return reject(err);
                }
                resolve(data);
            });
        });
    }
    hset(roomId, key, value) {
        this.pub.hset(roomId, key, value);
    }
    hget(roomId, key) {
        return this.hgetAsync(roomId, key);
    }
    hdel(roomId, key) {
        this.pub.hdel(roomId, key);
    }
    hlen(roomId) {
        return this.hlenAsync(roomId);
    }
    incr(key) {
        return this.incrAsync(key);
    }
    decr(key) {
        return this.decrAsync(key);
    }
}
exports.RedisPresence = RedisPresence;
