import dotenv from 'dotenv';

dotenv.config();

import app from "./app";
import { Server } from 'socket.io';
import {createServer} from "http";
import { setupSocket } from './socket/setup.socket';



const PORT = process.env.PORT || 5000;


const server = createServer(app);

const io = new Server(server,{
    cors:{
        origin:process.env.FRONTEND_URL,
        credentials:true
    }
})

setupSocket(io);


server.listen(PORT,()=>{
    console.log('Server Started');
})