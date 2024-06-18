import express from 'express';
import { createServer } from 'http';
import initSocket from './init/socket.js';
import registerHandler from './handlers/register.handler.js';
import dotenv from "dotenv";
// import { loadGameAssets } from './init/assets.js';

dotenv.config();

const app = express();
const server = createServer(app);
const PORT = 3306;


const io = initSocket(server); // initSocket에서 반환된 io 객체를 받아옴

//json 파싱
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static('client'));

initSocket(server);

app.post('/register', (req, res) => {
  registerHandler(req, res, io);
});

server.listen(PORT, async () => {
  console.log(`포트 ${PORT} 서버가 실행되었습니다`);
});
