import { getGameAssets } from '../init/assets.js';
import { getStage } from '../models/stage.model.js';

export const monsterDead = (uuid, payload) => {
  // 검증
  const currentStage = getStage(uuid);
  // 클라이언트의 현재 스테이지와 서버의 현재 스테이지가 일치하는지
  if (currentStage !== payload.stage)
    return { status: 'false', message: "Client stage unmatched with server's stage" };

  // uuid의 현재 스테이지에 monsterLvl의 monsterType이 나올 수 있는지? Lvl만 검증중
  const { stages } = getGameAssets();
  for (let stage of stages.data) {
    if (stage.id === payload.stage) {
      if (stage.monsterLevel < payload.monsterLvl) {
        return { status: 'false', message: "Monster level that can't come out of this stage" };
      }
      break;
    }
  }

  let monsterType;
  switch (payload.monsterNmb) {
    case 1:
      monsterType = '외눈이';
      break;
    case 2:
      monsterType = '애벌레';
      break;
    case 3:
      monsterType = '주둥이';
      break;
    case 4:
      monsterType = '여드름';
      break;
    case 5:
      monsterType = '박쥐';
      break;
    default:
      return { status: 'false', message: "A monster number that doesn't exist" };
  }

  const message = `You just got rid of a ${payload.monsterLvl}Lv ${monsterType}`;
  console.log(message);
  return { status: 'success', message };
};
