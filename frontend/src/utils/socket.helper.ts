import { io } from "socket.io-client";


const URL = "https://logichubapi.envriocart.shop/";
// const URL = "http://localhost:5000/";

const socket = io(URL, {
    withCredentials: true,
    auth: {
        token: typeof window !== "undefined" ? localStorage.getItem("accessToken") : "",
    }
});

export default socket;
