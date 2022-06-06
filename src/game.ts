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
    if (this.currentTeamIndex >= this.teams.length - 1) {
      this.currentTeamIndex = 0;
    } else {
      this.currentTeamIndex++;
    }
  }
}

export class Team {
  id: string;
  players: Player[] = [];
  currentPlayerIndex = 0;

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
    if (this.currentPlayerIndex >= this.players.length - 1) {
      this.currentPlayerIndex = 0;
    } else {
      this.currentPlayerIndex++;
    }
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
