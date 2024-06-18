import { gameEnd } from './game.handler.js';

export const userDead = (uuid, payload) => {
  // 검증
  // 진짜 죽었나?
  gameEnd(uuid, payload);
  return { status: 'success', message: 'You just dead..' };
};
