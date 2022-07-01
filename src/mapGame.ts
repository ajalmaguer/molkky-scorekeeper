import { Game } from './game';

export interface GameDataRow {
  roundIndex: number;
  [teamName: string]: any;
}

export function runningTotalKey(teamName: string): string {
  return teamName + 'runningTotal';
}

export function mapGame(game: Game): GameDataRow[] {
  const output: GameDataRow[] = [];

  game.teams.forEach((team) => {
    team.scoresForDisplay.forEach((score, scoreIndex) => {
      const newData = {
        [team.name]: score.score,
        [runningTotalKey(team.name)]: score.runningTotal,
      };

      if (!output[scoreIndex]) {
        output.push({
          roundIndex: scoreIndex,
          ...newData,
        });
      } else {
        output[scoreIndex] = {
          ...output[scoreIndex],
          ...newData,
        };
      }
    });
  });

  return output;
}
