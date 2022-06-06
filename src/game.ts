import { v4 as uuid } from 'uuid';

export class Game {
  teams: Team[] = [];

  addTeam(name: string) {
    const newTeam = new Team(name);
    this.teams.push(newTeam);
    return newTeam.id;
  }

  removeTeam(index: number) {
    this.teams.splice(index, 1);
  }
}

export class Team {
  id: string;
  players: Player[] = [];

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
