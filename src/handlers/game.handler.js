import { getGameAssets } from '../init/assets.js';
import { clearStage, getStage, setStage } from '../models/stage.model.js';

import { userDataClient } from "../utils/prisma/index.js";

export const gameStart = async (uuid, payload) => {
  //uuid 받는다고 가정
  console.log('gamestaret', uuid);
  const { stages } = getGameAssets();

  const userData = await userDataClient.user.findFirst({
    where: { uuid: uuid }
  })

  clearStage(uuid);

  setStage(uuid, stages.data[0].id, payload);

  console.log('Stage: ', getStage(uuid));

  return { status: 'success', userData };
};

export const gameEnd = async (uuid, payload) => {

  if (payload.score >= payload.highScore) {
    const recordHighScore = await userDataClient.user.update({
      where: { uuid: uuid },
      data: {
        highScore: payload.highScore
      }
    })
  }



  return { status: 'sueccess', message: '게임 종료' };
};
