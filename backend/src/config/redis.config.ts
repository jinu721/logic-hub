import { createClient } from 'redis';
import { env } from './env';

const client = createClient({
    username: env.REDIS_USERNAME,
    password: env.REDIS_PASSWORD,
    socket: {
        host: env.REDIS_HOST || "localhost",
        port: parseInt(env.REDIS_PORT as string) || 12993
    }
});

client.on('error', err => console.log('Redis Client Error', err));


export const redisConnect = async () => {
    try {
        await client.connect();
        console.log("Redis Connected Successfully");
    } catch (err) {
        console.log(err);
    }
}

export default client;