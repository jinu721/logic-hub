import { io } from "socket.io-client";


const URL = process.env.NEXT_PUBLIC_BACKEND_URL;

const socket = io(URL, {
    withCredentials: true,
    auth: {
        token: typeof window !== "undefined" ? localStorage.getItem("accessToken") : "",
    }
});

export default socket;
