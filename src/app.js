import express from 'express';
import { createServer } from 'http';
import initSocket from './init/socket.js';

const app = express();
const server = createServer(app);
const PORT = 3306;

//json 파싱
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static('client'));

initSocket(server);

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
