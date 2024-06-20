// tower.model.js

const towers = {};

export const getTower = (uuid) => {
  return towers[uuid];
};

export const setTower = (uuid, id, payload) => {
  return towers[uuid].push({ id, payload });
};

export const clearTower = (uuid) => {
  towers[uuid] = [];
};
