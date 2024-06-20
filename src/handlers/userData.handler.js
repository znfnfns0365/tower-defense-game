import client from '../utils/redis/redisClient.js';

// username을 key값으로 data 불러오기
export function getUser(username) {
  return new Promise((resolve, reject) => {
    client.get(username, (err, reply) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(reply);
    });
  });
}

// redis는 key-value 형식이어서 username-data로 저장해놔서 uuid로 검색이 안 됩니다.
// uuid로 username을 찾는 함수
// redis에 있는 key값(username들)을 모두 불러와서 data에 uuid가 찾으려는 uuid와 일치하면 username을 return함
export function getUsername(uuid) {
  return new Promise((resolve, reject) => {
    client.keys('*', (err, reply) => {
      if (err) {
        reject(err);
        return;
      }
      for (let id of reply) {
        client.get(id, (err, reply) => {
          const getId = JSON.parse(reply);
          if (uuid === getId.uuid) {
            resolve(getId.username);
          }
        });
      }
    });
  });
}

// redis에 username을 key값으로 value에 userData 저장
export function setUser(username, userData) {
  client.set(username, JSON.stringify(userData), (err, value) => {
    if (err) {
      console.log('Error set userUUID', err);
      return;
    }
    console.log('User data saved to Redis: ', userData);
  });
}
