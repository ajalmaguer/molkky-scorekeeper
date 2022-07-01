import { Game } from './game';

const key = 'mollkyGame';

export const LocalStorageService = {
  getGame: function (): Game {
    try {
      const stringifiedGame = localStorage.getItem(key);
      if (stringifiedGame) {
        return new Game(JSON.parse(stringifiedGame));
      } else {
        return new Game({});
      }
    } catch (error) {
      return new Game({});
    }
  },
  backupGame: function (game: Game) {
    try {
      localStorage.setItem(key, JSON.stringify(game));
    } catch (error) {}
  },
};
