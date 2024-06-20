// tower.model.js

const towers = {};

export const clearTower = (uuid) => {
  towers[uuid] = [];
};

export const getTower = (uuid) => {
  return towers[uuid];
};

export const addTower = (uuid, payload) => {
  // towers[uuid].
};

export const updateTower = (uuid, payload) => {};

export const deleteTower = (uuid, payload) => {};
