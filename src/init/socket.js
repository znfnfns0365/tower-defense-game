import {Server as SocketIO} from 'socket.io';
import registerHandler from '../handlers/register.handler.js';

const initSocket = (server)=>{
    const io = new SocketIO();
    io.attach(server);
    return io;
}

export default initSocket;