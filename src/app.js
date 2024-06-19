import express from 'express';
import { createServer } from 'http';
import initSocket from './init/socket.js';
import registerHandler from './handlers/register.handler.js';
import loginHandler from './handlers/login.handler.js'
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { loadGameAssets } from './init/assets.js';

dotenv.config();

const app = express();
const server = createServer(app);
const PORT = 3000;


const io = initSocket(server); // initSocket에서 반환된 io 객체를 받아옴

//json 파싱
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static('client'));


app.post('/register', (req, res) => {
  registerHandler(req, res, io);
});

app.post('/login', (req, res) => {
  loginHandler(req, res, io);
})

server.listen(PORT, async () => {
  console.log(`포트 ${PORT} 서버가 실행되었습니다`);

  try {
    //이 곳에서 파일 읽음
    const assets = await loadGameAssets();
    console.log(assets);
    console.log("Assets loaded successfully");
  } catch (e) {
    console.error("Failed to load game assets", e);
  }

});
