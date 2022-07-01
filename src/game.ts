import { v4 as uuid } from 'uuid';

export class Game {
  teams: Team[] = [];
  currentTeamIndex = 0;

  constructor(initialGame: Partial<Game>) {
    console.log({ initialGame });
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
    return newTeam.id;
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
}

export class Team {
  id: string;
  players: Player[] = [];
  currentPlayerIndex = 0;
  scores: number[] = [];
  name: string = '';

  constructor(initialTeam: Partial<Team>) {
    this.id = uuid();
    if (initialTeam.name) {
      this.name = initialTeam.name;
    }
    if (initialTeam.players) {
      this.players = initialTeam.players.map((player) => new Player(player));
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
    return this.scores.reduce((prev, curr) => prev + curr, 0);
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
    this.id = uuid();
    if (initialPlayer.name) {
      this.name = initialPlayer.name;
    }
    if (initialPlayer.id) {
      this.id = initialPlayer.id;
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
