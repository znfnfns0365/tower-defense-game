export const monsterDead = (uuid, payload) => {
  // 검증
  // uuid의 현재 스테이지에 monsterLvl의 monsterType이 나올 수 있는지?

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
