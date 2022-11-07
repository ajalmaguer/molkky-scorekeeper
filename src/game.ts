import { v4 as uuid } from 'uuid';

export class Game {
  teams: Team[] = [];
  currentTeamIndex = 0;

  constructor(initialGame: Partial<Game>) {
    if (initialGame.teams) {
      this.teams = initialGame.teams.map((team) => new Team(team));
    }
    if (initialGame.currentTeamIndex) {
      this.currentTeamIndex = initialGame.currentTeamIndex;
    }
  }

  addTeam(name: string) {
    const newTeam = new Team({ name });
    this.teams.push(newTeam);
    return newTeam;
  }

  addTeamWithPlayer(name: string, playerName: string) {
    const team = this.addTeam(name);
    team.addPlayer(playerName);
    return team;
  }

  removeTeam(index: number) {
    this.teams.splice(index, 1);
  }

  get whosNext(): Player | null {
    return this.teams[this.currentTeamIndex]?.whosNext ?? null;
  }

  nextPlayer() {
    this.teams[this.currentTeamIndex].nextPlayer();
    this.currentTeamIndex = (this.currentTeamIndex + 1) % this.teams.length;
  }

  submitScoreForCurrentTeam(score: number) {
    this.teams[this.currentTeamIndex].addScore(score);
    this.nextPlayer();
  }

  resetScoresForNextGame() {
    this.teams.forEach((team) => {
      team.scores = [];
    });
  }
}

export class Team {
  id: string;
  players: Player[] = [];
  currentPlayerIndex = 0;
  scores: number[] = [];
  name: string = '';

  constructor(initialTeam: Partial<Team>) {
    if (initialTeam.id) {
      this.id = initialTeam.id;
    } else {
      this.id = uuid();
    }
    if (initialTeam.name) {
      this.name = initialTeam.name;
    }
    if (initialTeam.currentPlayerIndex) {
      this.currentPlayerIndex = initialTeam.currentPlayerIndex;
    }
    if (initialTeam.players) {
      this.players = initialTeam.players.map((player) => new Player(player));
    }
    if (initialTeam.scores) {
      this.scores = initialTeam.scores;
    }
  }

  updateName(newName: string) {
    this.name = newName;
  }

  addPlayer(name: string) {
    this.players.push(new Player({ name }));
  }

  removePlayer(index: number) {
    this.players.splice(index, 1);
  }

  get whosNext(): Player {
    return this.players[this.currentPlayerIndex];
  }

  nextPlayer() {
    this.currentPlayerIndex =
      (this.currentPlayerIndex + 1) % this.players.length;
  }

  addScore(score: number) {
    this.scores.push(score);
  }

  editScore(scoreIndex: number, newScore: number) {
    this.scores[scoreIndex] = newScore;
  }

  removeScore(scoreIndex: number) {
    this.scores.splice(scoreIndex, 1);
  }

  get totalScore(): number {
    let runningTotal = 0;

    this.scores.forEach((score) => {
      runningTotal += score;
      if (runningTotal > 50) {
        runningTotal = 25;
      }
    });

    return runningTotal;
  }

  get scoresForDisplay(): ScoreForDisplay[] {
    let runningTotal = 0;
    return this.scores.map((score) => {
      runningTotal += score;
      if (runningTotal > 50) {
        runningTotal = 25;
      }
      return {
        score,
        runningTotal: runningTotal,
      };
    });
  }
}

export class Player {
  id: string;
  name = '';

  constructor(initialPlayer: Partial<Player>) {
    if (initialPlayer.id) {
      this.id = initialPlayer.id;
    } else {
      this.id = uuid();
    }
    if (initialPlayer.name) {
      this.name = initialPlayer.name;
    }
  }

  updateName(newName: string) {
    this.name = newName;
  }
}

export class ScoreForDisplay {
  score = 0;
  runningTotal = 0;
}
