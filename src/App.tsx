import { FormEvent, FormEventHandler, useRef, useState } from 'react';
import './App.css';
import { Column, DataTable } from './data_table';
import { Game, Player, ScoreForDisplay, Team } from './game';

const seedGame = new Game();
seedGame.addTeam('team 1');
seedGame.teams[0].addPlayer('player a');
seedGame.teams[0].addPlayer('player b');
seedGame.addTeam('team 2');
seedGame.teams[1].addPlayer('player x');
seedGame.teams[1].addPlayer('player y');

seedGame.teams[0].addScore(5);
seedGame.teams[0].addScore(5);
seedGame.teams[0].addScore(4);

seedGame.teams[1].addScore(2);
seedGame.teams[1].addScore(2);
seedGame.teams[1].addScore(5);

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
  const { current: game } = useRef(seedGame);
  const [mappedGame, setMappedGame] = useState(mapGame(seedGame));
  const [whosNext, setWhosNext] = useState(seedGame.whosNext);
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

  function skipPlayer() {
    game.nextPlayer();
    setMappedGame(mapGame(game));
    setWhosNext(game.whosNext);
  }

  function submitCurrentTeamScore(e: FormEvent) {
    e.preventDefault();
    const formData = new FormData(e.target! as HTMLFormElement);

    const score = Number(formData.get('score'));
    if (typeof score !== 'number') {
      console.log('score is not a number');
      return;
    }
    game.submitScoreForCurrentTeam(score);
    setMappedGame(mapGame(game));
    setWhosNext(game.whosNext);
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
