import { Game } from './game';

function getGame() {
  return new Game({});
}

export const GameService = {
  getGame,
};
