import { setStage } from '../models/stage.model.js';

export const baseAttacked = (uuid, payload) => {
  const message = `Your base has been attacked!
Monster's attackPower: ${payload.attackPower}
Remaining base hp: ${payload.hp}`;
  console.log(message);
  return { status: 'success', message };
};

export const nextStage = (uuid, payload) => {
  setStage(uuid, payload);
  const message = `Next Stage: ${payload.stage}`;
  console.log(message);
  return { status: 'success', message };
};
