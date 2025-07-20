import mongoose from 'mongoose';
import { env } from './env';


export default class Database{
    private static instance:mongoose.Connection;

    private constructor(){};

    public static async getInstance():Promise<mongoose.Connection>{
        if(!Database.instance){
            try{
                const connection = await mongoose.connect(env.MONGO_URL as string);
                Database.instance = connection.connection;
                console.log('DB Connected Successfully');
            }catch(err){
                if(err instanceof Error){
                    throw new Error(err.message);
                }else{
                    throw new Error('failed to connect DB');
                }
            }
        }
        return Database.instance;
    }
}
