import { getGameAssets } from '../init/assets.js';
import { addTower, deleteTower, getTower, updateTower } from '../models/tower.model.js';

export const createTower = (uuid, payload) => {
  console.log(payload);
  addTower(uuid, payload);

  return { status: 'sueccess', message: '타워 생성 완료' };
};

export const towerUpgrade = (uuid, payload) => {
  updateTower(uuid, payload);
  return { status: 'sueccess', message: '타워 업그레이드 완료' };
};

export const sellTower = (uuid, payload) => {
  deleteTower(uuid, payload);
  return { status: 'sueccess', message: '타워 판매 완료' };
};
