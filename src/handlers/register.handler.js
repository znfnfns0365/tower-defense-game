import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import {v4 as uuidv4} from 'uuid';
// register.handler.js
//해당 파일에 register 

const prisma = new PrismaClient();


const registerHandler = async (req, res, io) =>{
    
    const { username, password }= req.body;

    io.on('connection',(socket)=>{
    const isExistUser = userDataClient.account.findFirst({
        where:{
            username,
        },
    })

    if(!isExistUser){
        socket.emit()
        return //실패시
    }

    const userUUID = uuidv4();
})
}

export default registerHandler;