import { baseAttacked, nextStage } from './base.handler.js';
import { gameStart, gameEnd } from './game.handler.js';
import { monsterDead } from './monster.handler.js';
import { createTower, sellTower, towerUpgrade } from './tower.handler.js';

const handlerMappings = {
  2: gameStart,
  3: gameEnd,
  22: baseAttacked,
  33: nextStage,
  44: monsterDead,
  55: createTower,
  66: towerUpgrade,
  77: sellTower,
};

export default handlerMappings;
