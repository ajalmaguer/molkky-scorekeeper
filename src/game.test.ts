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

describe('whosNext', () => {
  it('returns null if no players', () => {
    const game = new Game();
    expect(game.whosNext).toBeNull();
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
    expect(game.whosNext?.name).toEqual('player a');
  });

  it('nextPlayer iterates through each player in each team', () => {
    expect(game.whosNext?.name).toEqual('player a');
    game.nextPlayer();
    expect(game.whosNext?.name).toEqual('player x');
    game.nextPlayer();
    expect(game.whosNext?.name).toEqual('player b');
    game.nextPlayer();
    expect(game.whosNext?.name).toEqual('player y');
    game.nextPlayer();
    expect(game.whosNext?.name).toEqual('player a');
  });
});

describe('scoring', () => {
  it('keeps track of scores', () => {
    const game = new Game();
    game.addTeam('Team 1');
    game.teams[0].addScore(5);
    expect(game.teams[0].totalScore).toEqual(5);
    game.teams[0].addScore(7);
    expect(game.teams[0].totalScore).toEqual(12);
  });

  it('you can edit scores', () => {
    const game = new Game();
    game.addTeam('Team 1');
    game.teams[0].addScore(5);
    expect(game.teams[0].totalScore).toEqual(5);
    game.teams[0].editScore(0, 7);
    expect(game.teams[0].totalScore).toEqual(7);
  });

  it('you can remove score', () => {
    const game = new Game();
    game.addTeam('Team 1');
    game.teams[0].addScore(5);
    game.teams[0].addScore(7);
    expect(game.teams[0].scores).toEqual([5, 7]);
    game.teams[0].removeScore(1);
    expect(game.teams[0].scores).toEqual([5]);
  });

  it('you can display running totals', () => {
    const team = new Team('team 1');
    team.addScore(5);
    team.addScore(7);
    expect(team.scoresForDisplay).toEqual([
      { score: 5, runningTotal: 5 },
      { score: 7, runningTotal: 12 },
    ]);
  });

  test('scoring resets if you go over 50', () => {
    const team = new Team('team 1');
    team.addScore(49);
    team.addScore(2);
    team.addScore(2);
    expect(team.scoresForDisplay).toEqual([
      { score: 49, runningTotal: 49 },
      { score: 2, runningTotal: 25 },
      { score: 2, runningTotal: 27 },
    ]);
  });
});

describe('Game > submitScoreForCurrentTeam', () => {
  it('submits score for team and goes to next team', () => {
    const game = new Game();
    game.addTeam('team 1');
    game.teams[0].addPlayer('player a');
    game.addTeam('team 2');
    game.teams[1].addPlayer('player x');

    game.submitScoreForCurrentTeam(5);
    expect(game.teams[0].scores).toEqual([5]);
    expect(game.whosNext?.name).toEqual('player x');
  });
});
