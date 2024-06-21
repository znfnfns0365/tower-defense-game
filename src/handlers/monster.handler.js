import { getGameAssets } from '../init/assets.js';
import { getStage } from '../models/stage.model.js';

export let score = 0;

export const monsterDead = (uuid, payload) => {
  // 검증
  const currentStage = getStage(uuid);
  // 클라이언트의 현재 스테이지와 서버의 현재 스테이지가 일치하는지
  if (currentStage !== payload.stage)
    return {
      status: 'false',
      message: "Client stage unmatched with server's stage",
      currentStage,
      stage: payload.stage,
    };

  // uuid의 현재 스테이지에 monsterLvl이 나올 수 있는지?
  const { stages } = getGameAssets();
  if (stages.data[currentStage].monsterLevel < payload.monsterLvl) {
    return { status: 'false', message: "Monster level that can't come out of this stage" };
  }

  // uuid의 현재 스테이지에 monsterType이 나올 수 있는지?
  const currentMonsterType = stages.data[currentStage].monsterType;
  const typeAccept = currentMonsterType.some((val) => {
    return val === payload.monsterNmb;
  });
  if (!typeAccept) {
    return { status: 'false', message: "Monster type that can't come out of this stage" };
  }

  let monsterType;
  switch (payload.monsterNmb) {
    case 0:
      monsterType = '외눈이';
      break;
    case 1:
      monsterType = '애벌레';
      break;
    case 2:
      monsterType = '주둥이';
      break;
    case 3:
      monsterType = '여드름';
      break;
    case 4:
      monsterType = '박쥐';
      break;
    case 5:
      monsterType = '고블린';
      break;
    default:
      return { status: 'false', message: "A monster number that doesn't exist" };
  }

  score += 100;
  const message = `You just got rid of a ${payload.monsterLvl}Lv ${monsterType}`;
  return { status: 'success', message };
};
