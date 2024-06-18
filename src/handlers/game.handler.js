import { getGameAssets } from "../init/assets.js";
import { clearStage, getStage, setStage } from "../models/stage.model.js";

export const gameStart = (uuid, payload) => {

    const { stages } = getGameAssets();

    clearStage(uuid);

    setStage(uuid, stages.data[0].id, payload.baseHP, payload.userGold, payload.currnetScore);

    console.log("Stage: ", getStage(uuid));

    return { status: "success", }
}