import { Game, Player, Team } from './game';

describe('Teams', () => {
  it('can create team', () => {
    const game = new Game();
    game.addTeam('team_1');
    expect(game.teams.map((t) => t.name).sort()).toEqual(['team_1']);
  });

  it('can delete team', () => {
    const game = new Game();
    game.addTeam('team_1');
    game.addTeam('team_2');
    expect(game.teams.map((t) => t.name).sort()).toEqual(['team_1', 'team_2']);
    game.removeTeam(1);
    expect(game.teams.map((t) => t.name).sort()).toEqual(['team_1']);
  });

  it('can update team', () => {
    const game = new Game();
    game.addTeam('team_1');
    game.teams[0].updateName('team awesome!');
    expect(game.teams.map((t) => t.name)).toEqual(['team awesome!']);
  });
});

describe('adding players to teams', () => {
  it('can add player to team', () => {
    const team = new Team('team_1');
    team.addPlayer('player_1');
    expect(team.players.map((player) => player.name)).toEqual(['player_1']);
  });
  it('can delete player from team', () => {
    const team = new Team('team_1');
    team.addPlayer('player_1');
    team.addPlayer('player_2');
    expect(team.players.map((player) => player.name)).toEqual([
      'player_1',
      'player_2',
    ]);
    team.removePlayer(1);
    expect(team.players.map((player) => player.name)).toEqual(['player_1']);
  });
  it('can update player name', () => {
    const team = new Team('team_1');
    team.addPlayer('player_1');
    team.players[0].updateName('foobar');
    expect(team.players.map((p) => p.name)).toEqual(['foobar']);
  });
});

describe('turns', () => {
  let game: Game;
  beforeEach(() => {
    game = new Game();
    game.addTeam('Team 1');
    game.teams[0].addPlayer('player a');
    game.teams[0].addPlayer('player b');
    game.addTeam('Team 2');
    game.teams[1].addPlayer('player x');
    game.teams[1].addPlayer('player y');
  });

  it('whosNext returns a player', () => {
    expect(game.whosNext.name).toEqual('player a');
  });

  it('nextPlayer goes to next player', () => {
    expect(game.whosNext.name).toEqual('player a');
    game.nextPlayer();
    expect(game.whosNext.name).toEqual('player x');
    game.nextPlayer();
    expect(game.whosNext.name).toEqual('player b');
    game.nextPlayer();
    expect(game.whosNext.name).toEqual('player y');
    game.nextPlayer();
    expect(game.whosNext.name).toEqual('player a');
  });
  // it.todo('team 1 scores 5', () => {
  //   // then its team 2 turn
  // });
  // it.todo('team 2 scores 11', () => {
  //   // then its team 1 turn again but new person's turn
  // });
});
