export default function registerHandler(io) {
    io.on('connection', (socket) => {
      console.log('새로운 클라이언트가 연결되었습니다.');
  
      // 타워 생성 이벤트 핸들러 추가
      socket.on('createTower', (towerData) => {
        console.log('타워 생성 요청:', towerData);
        
        // 모든 클라이언트에게 타워 생성 이벤트 브로드캐스트
        io.emit('towerCreated', towerData);
      });
  
      socket.on('disconnect', () => {
        console.log('클라이언트가 연결을 종료했습니다.');
      });
    });
  }
  