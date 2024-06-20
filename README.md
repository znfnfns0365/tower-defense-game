# tower-defense-game

### AWS 배포 링크

- [tower-defense-game](13.209.10.190:3000)

### 기능

- 회원가입/로그인

  - 회원가입 페이지에서 Id와 비밀번호 입력
  - 데이터 베이스에 고유 uuid와 최고 점수 0점 저장 됨
  - 로그인 시 고유 uuid 쿠키 생성

- 타워 구입 기능

  - 타워 구매시 골드 차감
  - 이후 몬스터 이동 경로 근처에 랜덤으로 생성

- 몬스터 처치 기능

  - 타워로 몬스터 공격후 hp가 0이하시 처치
  - 처치 후 골드와 몬스터 별 점수 획득

- 타워 환불 기능

  - 타워 환불시 골드 추가
  -

- 타워 업그레이드 기능

  - 타워 업그레이드시 골드 차감
  - 업스레이드시 타워 위에 별 추가
  -

- ## 보물 고블린 출현 기능

- ## 최고 기록 갱신 기능

### Skills

![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![redis](https://img.shields.io/badge/redis-FF4438?style=for-the-badge&logo=redis&logoColor=white)
![Socket.io](https://img.shields.io/badge/Socket.io-010101?style=for-the-badge&logo=Socket.io&logoColor=white)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=HTML5&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![javascript](https://img.shields.io/badge/javascript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![node.js](https://img.shields.io/badge/node.js-5FA04E?style=for-the-badge&logo=node.js&logoColor=white)
![.env](https://img.shields.io/badge/.env-ECD53F?style=for-the-badge&logo=.env&logoColor=black)
![yarn](https://img.shields.io/badge/yarn-2C8EBB?style=for-the-badge&logo=yarn&logoColor=white)
![amazonrds](https://img.shields.io/badge/amazonrds-527FFF?style=for-the-badge&logo=amazonrds&logoColor=white)
![amazonec2](https://img.shields.io/badge/amazonec2-FF9900?style=for-the-badge&logo=amazonec2&logoColor=white)
![prettier](https://img.shields.io/badge/prettier-F7B93E?style=for-the-badge&logo=prettier&logoColor=black)
![git](https://img.shields.io/badge/git-F05032?style=for-the-badge&logo=git&logoColor=white)
![github](https://img.shields.io/badge/github-181717?style=for-the-badge&logo=github&logoColor=white)

### 폴더 구조

```markdown
assets/
├── monster.json
└── stage.josn

client/
├── images/
│├── base.png
│├── bg.webp
│├── favicon.ico
│├── monstre1.png
│├── monstre2.png
│├── monstre3.png
│├── monstre4.png
│├── monstre5.png
│├── monstre6.png
│├── path.png
│└── tower.png
├── src/
│├── base.js
│├── Constants.js
│├── game.js
│├── login.js
│├── monster.js
│├── register.js
│└── tower.js
├── index.html
├── login.html
└── register.html
node_modules/

prisma/
└── schema.prisma

src/
├── handler.js/
│ ├── base.handler.js
│ ├── game.handler.js
│ ├── handlerMapping.js
│ ├── helper.js
│ ├── index.handler.js
│ ├── login.handler.js
│ ├── monster.handler.js
│ └── register.handler.js
├── inint/
│ ├── assets.js
│ └── socket.js
├── models/
│ ├── stage.model.js/
│ └── user.model.js
├── utils/
│ ├── app.js
│ └── constants.js
└──

.env
.gitignore
.prettierrc
package.json
README.md
yarn.lock
```
