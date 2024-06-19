import { getGameAssets } from '../init/assets.js';
import { clearStage, getStage, setStage } from '../models/stage.model.js';

// import { prisma } from '../../utils/prisma/index.js';

export const gameStart = (uuid, payload) => {
  //uuid 받는다고 가정
  console.log('gamestaret');
  const { stages } = getGameAssets();

  //   if (stages.data[0].monsterLevel != payload.monsterLevel) {
  //     return { status: 'fail', message: '몬스터 레벨이 일치하지 않습니다.' };
  //   }

  //   if (stages.data[0].monsterSpawnInterval != payload.monsterSpawnInterval) {
  //     return { status: 'fail', message: '몬스터 생성주기가 일치하지 않습니다.' };
  //   }

  //   if (false) {
  //     //추후 로그인후 찾은 정보 바탕으로 최고 점수 받고 검증로직 작성
  //     return { status: 'fail', message: '해당 유저의 최고점수가 일치하지 않습니다.' };
  //   }

  clearStage(uuid);

  setStage(uuid, stages.data[0].id, payload);

  console.log('Stage: ', getStage(uuid));

  return { status: 'success', uuid };
};

export const gameEnd = (uuid, payload) => {
  const score = payload.score;

  if (false) {
    //추후 로그인후 찾은 정보 바탕으로 최고 점수 받고 검증로직 작성
    const highScore = score;
  }

  // const recordHighScore = prisma.user.update({
  //     where: { accountId: uuid },
  //     data: {
  //         highScore: highScore
  //     }
  // })

  return { status: 'sueccess', message: '게임 종료', score };
};
