import { FormEvent, useRef, useState } from 'react';
import './App.css';
import { Column, DataTable } from './data_table';
import { Game } from './game';
import { LocalStorageService } from './localStorageService';

interface GameDataRow {
  roundIndex: number;
  [teamName: string]: any;
}

function runningTotalKey(teamName: string): string {
  return teamName + 'runningTotal';
}

function mapGame(game: Game): GameDataRow[] {
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

function App() {
  const { current: game } = useRef(LocalStorageService.getGame());
  const [mappedGame, setMappedGame] = useState(mapGame(game));
  const [whosNext, setWhosNext] = useState(game.whosNext);
  const formRef = useRef<HTMLFormElement>(null);

  const columns: Column<GameDataRow>[] = [
    {
      header: '',
      content: (rowData) => {
        return <>Round {rowData.roundIndex + 1}</>;
      },
    },
  ];
  game.teams.forEach((team) => {
    columns.push({
      header: (
        <>
          <div>{team.name}</div>
          <div>{team.players.map((player) => player.name).join(' / ')}</div>
        </>
      ),
      content: (rowData) => (
        <>
          {rowData[team.name]} / {rowData[runningTotalKey(team.name)]}
        </>
      ),
    });
  });

  function updateGame(cb: () => void) {
    cb();
    setMappedGame(mapGame(game));
    setWhosNext(game.whosNext);
    LocalStorageService.backupGame(game);
  }

  function skipPlayer() {
    updateGame(() => game.nextPlayer());
  }

  function submitCurrentTeamScore(e: FormEvent) {
    e.preventDefault();
    const formData = new FormData(e.target! as HTMLFormElement);
    const score = Number(formData.get('score'));
    if (typeof score !== 'number') {
      console.log('score is not a number');
      return;
    }
    updateGame(() => game.submitScoreForCurrentTeam(score));
    formRef.current?.reset();
  }

  return (
    <div className="App">
      <header className=""></header>

      <DataTable columns={columns} data={mappedGame} className="table" />

      {whosNext && <div>Next Player: {whosNext.name}</div>}
      <div>
        <form onSubmit={submitCurrentTeamScore} ref={formRef}>
          <input type="number" name="score" min={0} max={12} />
          <button type="submit">Submit</button>
        </form>
      </div>
      <div>
        <button onClick={skipPlayer}>Skip Player</button>
      </div>
    </div>
  );
}

export default App;
