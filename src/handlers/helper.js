import { CLIENT_VERSION } from '../constants.js';
import handlerMappings from './handlerMapping.js';

export const handleDisconnect = (socket) => {};

export const handleConnection = (socket) => {
  console.log('서버 연결 완료');

  socket.emit('connection', { message: '연결 완료' });
};

export const handlerEvent = (io, socket, data) => {
  if (!CLIENT_VERSION.includes(data.clientVersion)) {
    socket.emit('response', { status: 'fail', message: 'Client version mismatch' });
    return;
  }

  console.log(data.payload.token);
  const handler = handlerMappings[data.handlerId];
  if (!handler) {
    socket.emit('response', { status: 'fail', message: 'Handler not found' });
    return;
  }
  const response = handler(data.userId, data.payload);

  if (response.broadcast) {
    io.emit('response', 'broadcast');
    return;
  }

  socket.emit('response', response);
};
