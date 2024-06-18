import { gameStart, gameEnd } from "./game.handler.js"

const handlerMappings = {
    2: gameStart,
    3: gameEnd,
}

export default handlerMappings