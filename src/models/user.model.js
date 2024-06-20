// import { userDataClient } from '../utils/prisma/index.js';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { setUser } from '../handlers/userData.handler.js';

//db에서 user를 저장
export const addUser = async (username, password) => {
  const hashedPassword = await bcrypt.hash(password, 10);

  const userUUID = uuidv4();

  //   const newUser = await userDataClient.user.create({
  //     data: {
  //       uuid: userUUID,
  //       username: username,
  //       password: hashedPassword,
  //     },
  //   });

  const userData = {
    uuid: userUUID,
    username: username,
    password: hashedPassword,
    highScore: 0,
  };

  setUser(username, userData);
  return userData;
};
