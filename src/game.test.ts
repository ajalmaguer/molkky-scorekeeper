import { Game } from './game';

describe('Teams', () => {
  it('can create team', () => {
    const game = new Game();
    game.addTeam('team_1');
    expect(game.teams.length).toEqual(1);
  });

  it('can delete team', () => {
    const game = new Game();
    game.addTeam('team_1');
    game.addTeam('team_2');
    expect(game.teams.length).toEqual(2);
    game.delete('team_2');
    expect(game.teams.length).toEqual(1);

    game.blah()
  });
  // it.todo('can update team', () => {});

  // describe('adding players to teams', () => {
  //   it.todo('can add player to team', () => {});
  //   it.todo('can read to players', () => {});
  //   it.todo('can delete player from team', () => {});
  //   it.todo('can update player name', () => {});
  // });
});

describe('example game with two teams, each team with two people', () => {
  // it.todo('team 1 scores 5', () => {
  //   // then its team 2 turn
  // });
  // it.todo('team 2 scores 11', () => {
  //   // then its team 1 turn again but new person's turn
  // });
});
