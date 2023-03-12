import { io } from "socket.io-client";
const socket = io("wss://baharapi.kportals.net", {
    transports: ["websocket", "polling"],
});

// socket.on('connect', () => {
//     console.log('Connected to socket', socket.id)
// });

export default socket;