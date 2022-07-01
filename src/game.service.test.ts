import { Game } from './game';
import { GameService } from './game.service';

test('create a new instance of a game with stringified json data', () => {
  const seedGame = new Game({});
  seedGame.addTeam('team 1');
  seedGame.teams[0].addPlayer('player a');
  seedGame.teams[0].addPlayer('player b');
  seedGame.addTeam('team 2');
  seedGame.teams[1].addPlayer('player x');
  seedGame.teams[1].addPlayer('player y');

  seedGame.teams[0].addScore(5);
  seedGame.teams[0].addScore(5);
  seedGame.teams[0].addScore(4);

  seedGame.teams[1].addScore(2);
  seedGame.teams[1].addScore(2);
  seedGame.teams[1].addScore(5);

  const stringifiedGame = JSON.stringify(seedGame);
  console.log(JSON.stringify(seedGame, null, 2));
  const restoredGame = new Game(JSON.parse(stringifiedGame));
});
