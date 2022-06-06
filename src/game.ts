export class Game {
  teams: Team[] = [];

  addTeam(name: string) {
    this.teams.push(new Team(name));
  }

  delete(name: string) {
    this.teams = this.teams.filter((team) => team.name !== name);
  }

  blah() {}
}

export class Team {
  constructor(public name: string) {}
}
