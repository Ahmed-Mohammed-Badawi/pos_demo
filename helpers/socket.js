import { io } from "socket.io-client";
const socket = io("wss://posapi.kportals.net", {
    transports: ["websocket", "polling"],
});

// socket.on('connect', () => {
//     console.log('Connected to socket', socket.id)
// });

export default socket;