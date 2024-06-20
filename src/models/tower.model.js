// tower.model.js

const towers = {};

export const clearTower = (uuid) => {
  towers[uuid] = {};
};

export const getTower = (uuid) => {
  return towers[uuid];
};

export const addTower = (uuid, payload) => {
  if (!towers[uuid]) towers[uuid] = {};
  towers[uuid][payload.towerNumber] = payload.level;
};

export const updateTower = (uuid, payload) => {
  if (!towers[uuid]) towers[uuid] = {};
  towers[uuid][payload.towerNumber]++;
};

export const deleteTower = (uuid, payload) => {
  delete towers[uuid][payload.towerNumber];
};
