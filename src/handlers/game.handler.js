import { getGameAssets } from '../init/assets.js';
import { clearStage, getStage, setStage } from '../models/stage.model.js';
import { clearTower } from '../models/tower.model.js';
import { getUser, getUsername, setUser } from './userData.handler.js';

export const gameStart = async (uuid, payload) => {
  //uuid 받는다고 가정
  console.log('gamestart');
  const { stages } = getGameAssets();

  // uuid로 username 찾기
  const username = await getUsername(uuid);
  console.log('username', username);

  // username을 key값으로 userData 불러오기
  const userData = JSON.parse(await getUser(username));

  clearStage(uuid);
  clearTower(uuid);

  setStage(uuid, payload);

  console.log('Stage: ', getStage(uuid));

  return { status: 'success', userData };
};

export const gameEnd = async (uuid, payload) => {
  if (payload.score >= payload.highScore) {
    const username = await getUsername(uuid);
    const userData = JSON.parse(await getUser(username));
    userData.highScore = payload.highScore;
    setUser(username, userData);
  }

  return { status: 'sueccess', message: '게임 종료' };
};
