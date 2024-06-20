// stage.model.js

const stages = {};

export const clearStage = (uuid) => {
  stages[uuid] = [];
};

export const getStage = (uuid) => {
  return stages[uuid];
};

export const setStage = (uuid, payload) => {
  return (stages[uuid] = payload.stage);
};
