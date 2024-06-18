import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

//db에서 user를 저장
export const addUser = async (username, password) =>{
    const hashedPassword = await bcrypt.hash(password, 10);

    const userUUID = uuidv4();

    const newUser = await prisma.user.create({
        data: {
            accountId: userUUID,
            id: username,
            password: hashedPassword,
        }
    });
    return newUser;
};