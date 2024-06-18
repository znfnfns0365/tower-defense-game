import jwt from "jsonwebtoken";
import { userDataClient } from "../utils/prisma/index.js";
import bcrypt from 'bcrypt';

// / 로그인 API /
const loginHandler = async (req, res, io) => {
  // 요청받은 데이터 accountId, accountPassword를 저장합니다.
  const { username, password } = req.body;

    try {
      // 해당 계정 id와 일치하는 계정 id가 있는지 DB에서 찾아봅니다.
      const account = await userDataClient.user.findFirst({
        where: { username },
      });
      // 해당 계정id가 DB에 존재하지 않는 계정id라면, 해당 사실을 알립니다.
      if (!account) return res.status(401).json({ message: "존재하지 않는 계정입니다." });
      // 입력받은 사용자의 비밀번호와 데이터베이스에 저장된 비밀번호를 비교합니다.
      else if (!(await bcrypt.compare(password, account.password)))
        return res.status(401).json({ message: "비밀번호가 일치하지 않습니다." });
  
      // jwt token 생성
      const token = jwt.sign(
        {
          type: "JWT",
          user_id: account.account_id,
        },
        process.env.JWT_SECRET_KEY,
        {
          expiresIn: "60m", // 60분 후 만료
        }
      );
  
      res.cookie("authorization", `Bearer ${token}`);
//쿠키나, 로컬 스토리지를 사용
      return res.status(200).json({message:"로그인 성공",
        account_id:account.account_id,
      })
    } catch (error) {
      console.error("로그인에 오류 발생!", error);
      return res.status(500).json("Server Error: 500");
    }
  };

  
export default loginHandler;