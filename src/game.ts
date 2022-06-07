import { v4 as uuid } from 'uuid';

export class Game {
  teams: Team[] = [];
  currentTeamIndex = 0;

  addTeam(name: string) {
    const newTeam = new Team(name);
    this.teams.push(newTeam);
    return newTeam.id;
  }

  removeTeam(index: number) {
    this.teams.splice(index, 1);
  }

  get whosNext(): Player {
    return this.teams[this.currentTeamIndex].whosNext;
  }

  nextPlayer() {
    this.teams[this.currentTeamIndex].nextPlayer();
    this.currentTeamIndex = (this.currentTeamIndex + 1) % this.teams.length;
  }
}

export class Team {
  id: string;
  players: Player[] = [];
  currentPlayerIndex = 0;
  scores: number[] = [];

  constructor(public name: string) {
    this.id = uuid();
  }

  updateName(newName: string) {
    this.name = newName;
  }

  addPlayer(playerName: string) {
    this.players.push(new Player(playerName));
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
      return {
        score,
        runningTotal: runningTotal,
      };
    });
  }
}

export class Player {
  id: string;

  constructor(public name: string) {
    this.id = uuid();
  }

  updateName(newName: string) {
    this.name = newName;
  }
}

export class ScoreForDisplay {
  score = 0;
  runningTotal = 0;
}
