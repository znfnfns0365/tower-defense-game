//import prisma, jwt, dotenv
//사용자가 로그인한 것을 증명하는 미들웨어
import jwt from "jsonwebtoken";
import { userDataClient } from "../utils/prisma/index.js";

export default async function (req, res, next) {
  try {
    const { authorization } = req.cookies;
    if (!authorization) throw new Error("토큰이 존재하지 않습니다.");

    const [tokenType, token] = authorization.split(" ");

    if (tokenType !== "Bearer") throw new Error("토큰 타입이 일치하지 않습니다.");

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);

    console.log("decodedToken:", decodedToken);

    const userId = decodedToken.user_id;
    const user = await userDataClient.account.findFirst({
      where: { account_id: userId },
    });

    console.log("user:", user);

    if (!user) {
      // res.clearCookie("authorization");
      throw new Error("토큰 사용자가 존재하지 않습니다.");
    }
    req.user = user;

    next();
  } catch (error) {
    console.error("Error in authMiddleware:", error);

    // res.clearCookie("authorization");
    switch (error.name) {
      case "TokenExpiredError":
        return res.status(401).json({ message: "토큰이 만료되었습니다." });
      case "JsonWebTokenError":
        return res.status(401).json({ message: "토큰이 조작되었습니다." });
      default:
        return res.status(401).json({ message: error.message ?? "비정상적인 요청입니다." });
    }
  }
}
