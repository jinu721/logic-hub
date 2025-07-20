import dotenv from 'dotenv';

dotenv.config();

import app from "./app";
import { Server } from 'socket.io';
import {createServer} from "http";
import { setupSocket } from './socket/setup.socket';
import { env } from './config/env';



const PORT = env.PORT;


const server = createServer(app);

const io = new Server(server,{
    cors:{
        origin:env.FRONTEND_URL,
        credentials:true
    }
})

setupSocket(io);


server.listen(PORT,()=>{
    console.log('Server Started');
})