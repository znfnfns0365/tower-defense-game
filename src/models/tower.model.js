// tower.model.js

const towers = {};

export const clearTower = (uuid) => {
  towers[uuid] = {};
};

export const getTower = (uuid) => {
  return towers[uuid];
};

export const addTower = (uuid, payload) => {
  console.log(payload);
  towers[uuid][payload.towerNumber] = payload.level;
};

export const updateTower = (uuid, payload) => {
  towers[uuid][payload.towerNumber]++;
};

export const deleteTower = (uuid, payload) => {
  delete towers[uuid][payload.towerNumber];
};
