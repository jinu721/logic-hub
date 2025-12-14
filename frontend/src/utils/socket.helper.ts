import { io } from "socket.io-client";


const URL = "http://localhost:5000/";
// const URL = "https://api.jinu.site/"

const socket = io(URL, {
    withCredentials: true,
    auth: {
        token: typeof window !== "undefined" ? localStorage.getItem("accessToken") : "",
    }
});

export default socket;
