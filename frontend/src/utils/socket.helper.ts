import {io} from "socket.io-client";



const socket = io("https://api.jinu.site/",{
    withCredentials:true,
});

export default socket;
