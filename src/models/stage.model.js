// stage.model.js

const stages = {};

export const createStage = (uuid) => {
  stages[uuid] = [];
};

export const getStage = (uuid) => {
  return stages[uuid];
};

export const setStage = (uuid, id, payload) => {
  return stages[uuid].push({ id, payload });
};

export const clearStage = (uuid) => {
  stages[uuid] = [];
};
