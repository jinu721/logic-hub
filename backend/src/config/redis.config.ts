import { createClient } from 'redis';

const client = createClient({
    username: 'default',
    password: '00FhWen3Y409iqFlLkzKGTzcDPLh9l2n',
    socket: {
        host: 'redis-13680.c323.us-east-1-2.ec2.redns.redis-cloud.com',
        port: 13680
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