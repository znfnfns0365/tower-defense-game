import { Base } from './base.js';
import { Monster } from './monster.js';
import { Tower } from './tower.js';
import { CLIENT_VERSION } from './Constants.js';

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
}

const fetchGameAssets = async () => {
  try {
    const response = await fetch('/api/assets'); // 서버의 API 엔드포인트에 요청 보내기
    const data = await response.json(); // JSON 형식으로 응답 데이터를 파싱
    return data;
  } catch (error) {
    console.error('Failed to fetch game assets:', error); // 요청에 실패한 경우 에러 처리
  }
};

let userId = null;
let serverSocket; // 서버 웹소켓 객체
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const NUM_OF_MONSTERS = 5; // 몬스터 개수

let userGold = 75; // 유저 골드
let base; // 기지 객체
let baseHp = 1000; // 기지 체력
let stage = 0; // 스테이지

let towerCost = 20; // 타워 구입 비용
let numOfInitialTowers = 3; // 초기 타워 개수
export let gameAssets = {};
let monsterLevel; // 몬스터 레벨
let monsterSpawnInterval; // 몬스터 생성 주기
const monsters = [];
const towers = [];

let score = 0; // 게임 점수
let highScore = 0; // 기존 최고 점수
let isInitGame = false;

// 이미지 로딩 파트
const backgroundImage = new Image();
backgroundImage.src = 'images/bg.webp';

const towerImage = new Image();
towerImage.src = 'images/tower.png';

const baseImage = new Image();
baseImage.src = 'images/base.png';

const pathImage = new Image();
pathImage.src = 'images/path.png';

const monsterImages = [];
for (let i = 1; i <= NUM_OF_MONSTERS; i++) {
  const img = new Image();
  img.src = `images/monster${i}.png`;
  monsterImages.push(img);
}

let monsterPath;

function generateRandomMonsterPath() {
  const path = [];
  let currentX = 0;
  let currentY = Math.floor(Math.random() * 21) + 500; // 500 ~ 520 범위의 y 시작 (캔버스 y축 중간쯤에서 시작할 수 있도록 유도)

  path.push({ x: currentX, y: currentY });

  while (currentX < canvas.width) {
    currentX += Math.floor(Math.random() * 100) + 50; // 50 ~ 150 범위의 x 증가
    // x 좌표에 대한 clamp 처리
    if (currentX > canvas.width) {
      currentX = canvas.width;
    }

    currentY += Math.floor(Math.random() * 200) - 100; // -100 ~ 100 범위의 y 변경
    // y 좌표에 대한 clamp 처리
    if (currentY < 0) {
      currentY = 0;
    }
    if (currentY > canvas.height) {
      currentY = canvas.height;
    }

    path.push({ x: currentX, y: currentY });
  }

  return path;
}

function initMap() {
  ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height); // 배경 이미지 그리기
  drawPath();
}

function drawPath() {
  const segmentLength = 20; // 몬스터 경로 세그먼트 길이
  const imageWidth = 60; // 몬스터 경로 이미지 너비
  const imageHeight = 60; // 몬스터 경로 이미지 높이
  const gap = 5; // 몬스터 경로 이미지 겹침 방지를 위한 간격

  for (let i = 0; i < monsterPath.length - 1; i++) {
    const startX = monsterPath[i].x;
    const startY = monsterPath[i].y;
    const endX = monsterPath[i + 1].x;
    const endY = monsterPath[i + 1].y;

    const deltaX = endX - startX;
    const deltaY = endY - startY;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY); // 피타고라스 정리로 두 점 사이의 거리를 구함 (유클리드 거리)
    const angle = Math.atan2(deltaY, deltaX); // 두 점 사이의 각도는 tan-1(y/x)로 구해야 함 (자세한 것은 역삼각함수 참고): 삼각함수는 변의 비율! 역삼각함수는 각도를 구하는 것!

    for (let j = gap; j < distance - gap; j += segmentLength) {
      // 사실 이거는 삼각함수에 대한 기본적인 이해도가 있으면 충분히 이해하실 수 있습니다.
      // 자세한 것은 https://thirdspacelearning.com/gcse-maths/geometry-and-measure/sin-cos-tan-graphs/ 참고 부탁해요!
      const x = startX + Math.cos(angle) * j; // 다음 이미지 x좌표 계산(각도의 코사인 값은 x축 방향의 단위 벡터 * j를 곱하여 경로를 따라 이동한 x축 좌표를 구함)
      const y = startY + Math.sin(angle) * j; // 다음 이미지 y좌표 계산(각도의 사인 값은 y축 방향의 단위 벡터 * j를 곱하여 경로를 따라 이동한 y축 좌표를 구함)
      drawRotatedImage(pathImage, x, y, imageWidth, imageHeight, angle);
    }
  }
}

function drawRotatedImage(image, x, y, width, height, angle) {
  ctx.save();
  ctx.translate(x + width / 2, y + height / 2);
  ctx.rotate(angle);
  ctx.drawImage(image, -width / 2, -height / 2, width, height);
  ctx.restore();
}

function getRandomPositionNearPath(maxDistance) {
  // 타워 배치를 위한 몬스터가 지나가는 경로 상에서 maxDistance 범위 내에서 랜덤한 위치를 반환하는 함수!
  const segmentIndex = Math.floor(Math.random() * (monsterPath.length - 1));
  const startX = monsterPath[segmentIndex].x;
  const startY = monsterPath[segmentIndex].y;
  const endX = monsterPath[segmentIndex + 1].x;
  const endY = monsterPath[segmentIndex + 1].y;

  const t = Math.random();
  const posX = startX + t * (endX - startX);
  const posY = startY + t * (endY - startY);

  const offsetX = (Math.random() - 0.5) * 2 * maxDistance;
  const offsetY = (Math.random() - 0.5) * 2 * maxDistance;

  return {
    x: posX + offsetX,
    y: posY + offsetY,
  };
}

function placeInitialTowers() {
  /* 
    타워를 초기에 배치하는 함수입니다.
    무언가 빠진 코드가 있는 것 같지 않나요? ->placenewtower로 로직 통합
  */

  //스테이지별 초기 타워 개수 세팅으로 변경
  for (let i = 0; i < numOfInitialTowers; i++) {
    placeNewTower();
  }
}

//타워 생성시 위치 검증로직(겹치지않게)
function isPositionValid(newX, newY) {
  return !towers.some((tower) => {
    const distance = Math.sqrt(Math.pow(tower.x - newX, 2) + Math.pow(tower.y - newY, 2));
    return distance < tower.width; // 타워 크기만큼 거리가 가까우면 겹침
  });
}

//타워 추가 생성시 유저 골드 확인 후 설치
function placeNewTower() {
  if (userGold >= towerCost) {
    let { x, y } = getRandomPositionNearPath(200);
    while (!isPositionValid(x, y)) {
      ({ x, y } = getRandomPositionNearPath(200));
    }
    const tower = new Tower(x, y);
    towers.push(tower);
    tower.draw(ctx, towerImage);
    userGold -= towerCost; // 골드 차감
    if (towers.length>3) { 
      towerCost += 1; // 구매비용 증가
    }
  } else {
    alert('골드가 부족합니다!');
  }
}

// 마지막에 설치된 타워 삭제 후 골드 추가
function removeTower() {
  if (towers.length > 0) {
    towerCost -=1; // 구매비용 감소
    userGold += towerCost;  // towerCost * 타워레벨? 또는 그냥 강화비용 만큼
    towers.pop();
  } else {
    alert('남은 타워가 없습니다!')
  }
}

function placeBase() {
  const lastPoint = monsterPath[monsterPath.length - 1];
  base = new Base(lastPoint.x, lastPoint.y, baseHp);
  base.draw(ctx, baseImage);
}

function spawnMonster() {
  const { stages } = gameAssets;
  const monsterType = stages.data[stage].monsterType;
  let monsterNumber = Math.floor(Math.random() * monsterType.length);
  monsters.push(
    new Monster(
      monsterPath,
      monsterImages,
      stages.data[stage].monsterLevel,
      stages.data[stage].monsterType[monsterNumber],
    ),
  );
}

function gameLoop() {
  // 렌더링 시에는 항상 배경 이미지부터 그려야 합니다! 그래야 다른 이미지들이 배경 이미지 위에 그려져요!
  ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height); // 배경 이미지 다시 그리기
  drawPath(monsterPath); // 경로 다시 그리기

  ctx.font = 'bold 25px Times New Roman';
  ctx.fillStyle = 'skyblue';
  ctx.fillText(`최고 기록: ${highScore}`, 100, 50); // 최고 기록 표시
  ctx.fillStyle = 'white';
  ctx.fillText(`점수: ${score}`, 100, 100); // 현재 스코어 표시
  ctx.fillStyle = 'yellow';
  ctx.fillText(`골드: ${userGold}`, 100, 150); // 골드 표시
  ctx.fillStyle = 'magenta';
  ctx.fillText(`현재 레벨: ${(stage % 10) + 1}`, 100, 200); // 최고 기록 표시
  ctx.fillStyle = 'lime';
  ctx.fillText(`포탑 가격: ${towerCost}`, 100, 250); // 최고 기록 표시


  // 타워 그리기 및 몬스터 공격 처리
  towers.forEach((tower) => {
    tower.draw(ctx, towerImage);
    tower.updateCooldown();
    monsters.forEach((monster) => {
      const distance = Math.sqrt(
        Math.pow(tower.x - monster.x, 2) + Math.pow(tower.y - monster.y, 2),
      );
      if (distance < tower.range) {
        tower.attack(monster);
        if (monster.hp <= 0) {
          userGold += monster.goldReward; // 몬스터 처치 시 골드 획득
          score += 10;
          // 몬스터 배열에서 제거
        }
      }
    });
  });

  // 몬스터가 공격을 했을 수 있으므로 기지 다시 그리기
  base.draw(ctx, baseImage);

  for (let i = monsters.length - 1; i >= 0; i--) {
    const monster = monsters[i];
    if (monster.hp > 0) {
      const isDestroyed = monster.move(base);
      if (isDestroyed === 'base') {
        /* 게임 오버 */
        if (highScore < score) highScore = score;
        alert('게임 오버. 스파르타 본부를 지키지 못했다...ㅠㅠ');
        //게임 오버시 이벤트 발생
        sendEvent(3, {
          userId,
          userGold,
          baseHp,
          numOfInitialTowers,
          monsterLevel,
          monsterSpawnInterval,
          score,
          highScore,
          monsters,
          towers,
        });
        location.reload();
      } else if (isDestroyed === 'monster') {
        sendEvent(22, {
          hp: base.hp,
          attackPower: monster.attackPower,
        });
      }
      monster.draw(ctx);
    } else if (monster.hp < 0) {
      /* 몬스터가 타워에 죽었을 때 */
      sendEvent(44, { monsterNmb: monster.monsterNumber, monsterLvl: monster.level, stage });
      score += 100;
      const { stages } = gameAssets;
      if (score >= stages.data[stage + 1].score) {
        stage++;
        sendEvent(33, { stage, score });
        const monsterSpawnInterval = stages.data[stage].monsterSpawnInterval; // 몬스터 생성 주기
        setInterval(spawnMonster, monsterSpawnInterval); // 설정된 몬스터 생성 주기마다 몬스터 생성
      }
      monsters.splice(i, 1);
    } else {
      monsters.splice(i, 1);
    }
  }

  requestAnimationFrame(gameLoop); // 지속적으로 다음 프레임에 gameLoop 함수 호출할 수 있도록 함
}

async function initGame(token) {
  if (isInitGame) {
    return;
  }

  gameAssets = await fetchGameAssets(); // json 파일 읽어오기
  const { stages } = gameAssets;

  monsterPath = generateRandomMonsterPath(); // 몬스터 경로 생성
  initMap(); // 맵 초기화 (배경, 몬스터 경로 그리기)
  placeInitialTowers(); // 설정된 초기 타워 개수만큼 사전에 타워 배치
  placeBase(); // 기지 배치

  monsterSpawnInterval = stages.data[stage].monsterSpawnInterval; // 몬스터 생성 주기
  setInterval(spawnMonster, monsterSpawnInterval); // 설정된 몬스터 생성 주기마다 몬스터 생성
  gameLoop(); // 게임 루프 최초 실행
  //게임 시작 이벤트 발생
  sendEvent(2, {
    userGold,
    baseHp,
    numOfInitialTowers,
    monsterLevel,
    monsterSpawnInterval,
    score,
    highScore,
    monsters,
    towers,
    token,
  });
  isInitGame = true;
}

// 이미지 로딩 완료 후 서버와 연결하고 게임 초기화
Promise.all([
  new Promise((resolve) => (backgroundImage.onload = resolve)),
  new Promise((resolve) => (towerImage.onload = resolve)),
  new Promise((resolve) => (baseImage.onload = resolve)),
  new Promise((resolve) => (pathImage.onload = resolve)),
  ...monsterImages.map((img) => new Promise((resolve) => (img.onload = resolve))),
]).then(() => {
  /* 서버 접속 코드 (여기도 완성해주세요!) */
  let authCookie = getCookie('authorization');
  //author, rest api post sign token socket.io-미들웨어 jwt 검증 =>잘못 튕구
  if (!authCookie) {
    // 쿠키에 'authorization' 토큰이 없으면 로그인 유도
    alert('로그인이 필요합니다. 로그인 페이지로 이동합니다.');
    window.location.href = '/login.html'; // 로그인 페이지로 이동
    return; // 로그인 페이지로 이동 후 아래 코드 실행되지 않도록 함
  }

  serverSocket = io('http://localhost:3000', {
    query: {
      clientVersion: CLIENT_VERSION,
    },
    auth: {
      token: authCookie, // 토큰이 저장된 어딘가에서 가져와야 합니다!
    },
  });

  serverSocket.on('response', (data) => {
    console.log(data);

    if (data.userData !== undefined) {
      highScore = data.userData.highScore;
      console.log('최고 점수 설정 완료: ', highScore);
    }
  });
  serverSocket.on('uuid', (data) => {
    userId = data;
    console.log('uuid 설정 완료: ', data);
  });

  serverSocket.on('connection', (data) => {
    console.log('connection: ', data);
  });

  console.log(serverSocket.auth.token);
  initGame(serverSocket.auth.token);
  /* 
    서버의 이벤트들을 받는 코드들은 여기다가 쭉 작성해주시면 됩니다! 
    e.g. serverSocket.on("...", () => {...});
    이 때, 상태 동기화 이벤트의 경우에 아래의 코드를 마지막에 넣어주세요! 최초의 상태 동기화 이후에 게임을 초기화해야 하기 때문입니다! 
    if (!isInitGame) {
      initGame();
    }
  */
});

export const sendEvent = (handlerId, payload) => {
  serverSocket.emit('event', {
    userId,
    clientVersion: CLIENT_VERSION,
    handlerId,
    payload,
  });
};

const buyTowerButton = document.createElement('button');
buyTowerButton.textContent = '타워 구입';
buyTowerButton.style.position = 'absolute';
buyTowerButton.style.top = '10px';
buyTowerButton.style.right = '10px';
buyTowerButton.style.padding = '10px 20px';
buyTowerButton.style.fontSize = '16px';
buyTowerButton.style.cursor = 'pointer';

buyTowerButton.addEventListener('click', placeNewTower);
document.body.appendChild(buyTowerButton);

const sellTowerButton = document.createElement('button');
sellTowerButton.textContent = '타워 판매';
sellTowerButton.style.position = 'absolute';
sellTowerButton.style.top = '60px';
sellTowerButton.style.right = '10px';
sellTowerButton.style.padding = '10px 20px';
sellTowerButton.style.fontSize = '16px';
sellTowerButton.style.cursor = 'pointer';

sellTowerButton.addEventListener('click', removeTower);
document.body.appendChild(sellTowerButton);
