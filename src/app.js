import express from 'express';
import { createServer } from 'http';
import initSocket from './init/socket.js';
import {loadGameAssets} from './init/assets.js';

const app = express();
const server = createServer(app);
const PORT = 3000;

  //파일 읽기
  const assets = await loadGameAssets();
  console.log(assets);
  
//json 파싱
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));
initSocket(server);

server.listen(PORT, async () => {
  console.log(`포트 ${PORT} 서버가 실행되었습니다`);
});
