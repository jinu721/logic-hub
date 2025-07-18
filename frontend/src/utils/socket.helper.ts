import {io} from "socket.io-client";



const socket = io(process.env.BACKEND_URL,{
    withCredentials:true,
});

export default socket;
