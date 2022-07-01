import { FormEvent, Fragment, useRef, useState } from 'react';
import './App.css';
import { Column, DataTable } from './data_table';
import { LocalStorageService } from './localStorageService';
import { GameDataRow, mapGame, runningTotalKey } from './mapGame';

function App() {
  const { current: game } = useRef(LocalStorageService.getGame());
  const [mappedGame, setMappedGame] = useState(mapGame(game));

  // ----------------------------------------
  // helper functions
  // ----------------------------------------
  function updateGame(cb: () => void) {
    cb();
    setMappedGame(mapGame(game));
    LocalStorageService.backupGame(game);
  }

  // ----------------------------------------
  // generate columns
  // ----------------------------------------
  const columns: Column<GameDataRow>[] = [
    {
      header: '',
      content: (rowData) => {
        return <>Round {rowData.roundIndex + 1}</>;
      },
    },
  ];
  game.teams.forEach((team, teamIndex) => {
    columns.push({
      header: (
        <>
          <div>
            {team.name}{' '}
            <button
              onClick={() =>
                removeTeam({
                  teamIndex,
                  teamName: team.name,
                })
              }
            >
              🗑
            </button>
            <button
              onClick={() =>
                renameTeam({
                  teamIndex,
                  teamName: team.name,
                  newName: prompt(`New name for ${team.name}`),
                })
              }
            >
              ✏️
            </button>
          </div>
          <div>
            {team.players.map((player, playerIndex) => (
              <Fragment key={playerIndex}>
                <span>{player.name}</span>
                <button
                  onClick={() =>
                    removePlayer({
                      teamIndex,
                      playerIndex,
                      teamName: team.name,
                      playerName: player.name,
                    })
                  }
                >
                  🗑
                </button>
                <button
                  onClick={() =>
                    renamePlayer({
                      teamIndex,
                      playerIndex,
                      newName: prompt(`New name for ${player.name}`),
                    })
                  }
                >
                  ✏️
                </button>
                {playerIndex !== team.players.length - 1 && <span>/</span>}
              </Fragment>
            ))}
          </div>
        </>
      ),
      content: (rowData) => {
        const score = rowData[team.name];
        return (
          <>
            {score} / {rowData[runningTotalKey(team.name)]}
            <button
              onClick={() =>
                editScore({
                  teamIndex,
                  scoreIndex: rowData.roundIndex,
                  newScore: Number(prompt(`Old score: ${score}, New score:`)),
                })
              }
            >
              ✏️
            </button>
          </>
        );
      },
    });
  });

  // ----------------------------------------
  // add/remove teams
  // ----------------------------------------
  const newTeamForm = useRef<HTMLFormElement>(null);
  function submitNewTeam(e: FormEvent) {
    e.preventDefault();
    const formData = new FormData(e.target! as HTMLFormElement);
    const name = formData.get('name');

    updateGame(() =>
      game.addTeam((name as string) || `Team ${game.teams.length + 1}`)
    );
    newTeamForm.current?.reset();
  }

  function removeTeam({
    teamIndex,
    teamName,
  }: {
    teamIndex: number;
    teamName: string;
  }) {
    if (confirm(`Remove team ${teamName}?`)) {
      updateGame(() => game.removeTeam(teamIndex));
    }
  }

  function renameTeam({
    teamIndex,
    teamName,
    newName,
  }: {
    teamIndex: number;
    teamName: string;
    newName: string | null;
  }) {
    if (!newName) {
      return;
    }
    updateGame(() => game.teams[teamIndex].updateName(newName || teamName));
  }

  // ----------------------------------------
  // add/remove players
  // ----------------------------------------
  const newPlayerForm = useRef<HTMLFormElement>(null);
  function submitNewPlayer(e: FormEvent) {
    e.preventDefault();
    const formData = new FormData(e.target! as HTMLFormElement);
    const name = formData.get('name');
    const team = formData.get('team');
    if (!name || !team) {
      return;
    }
    console.log({ name, team });

    updateGame(() =>
      game.teams[parseInt(team as string)].addPlayer(name as string)
    );
    newPlayerForm.current?.reset();
  }

  function removePlayer({
    teamIndex,
    playerIndex,
    teamName,
    playerName,
  }: {
    teamIndex: number;
    playerIndex: number;
    teamName: string;
    playerName: string;
  }) {
    if (confirm(`Remove ${playerName} from ${teamName}?`)) {
      updateGame(() => {
        game.teams[teamIndex].removePlayer(playerIndex);
      });
    }
  }

  function renamePlayer({
    teamIndex,
    playerIndex,
    newName,
  }: {
    teamIndex: number;
    playerIndex: number;
    newName: string | null;
  }) {
    if (!newName) {
      return;
    }
    updateGame(() => {
      game.teams[teamIndex].players[playerIndex].updateName(newName);
    });
  }

  // ----------------------------------------
  // submit/edit score
  // ----------------------------------------
  const currentScoreForm = useRef<HTMLFormElement>(null);
  function submitCurrentTeamScore(e: FormEvent) {
    e.preventDefault();
    const formData = new FormData(e.target! as HTMLFormElement);
    const score = Number(formData.get('score'));
    if (typeof score !== 'number' || isNaN(score)) {
      console.log('score is not a number');
      return;
    }
    updateGame(() => game.submitScoreForCurrentTeam(score));
    currentScoreForm.current?.reset();
  }

  function editScore({
    teamIndex,
    scoreIndex,
    newScore,
  }: {
    teamIndex: number;
    scoreIndex: number;
    newScore: number;
  }) {
    if (typeof newScore !== 'number' || isNaN(newScore)) {
      console.log('score is not a number');
      return;
    }
    if (newScore < 0 || newScore > 12) {
      return;
    }
    updateGame(() => (game.teams[teamIndex].scores[scoreIndex] = newScore));
  }

  // ----------------------------------------
  // skip player
  // ----------------------------------------
  function skipPlayer() {
    updateGame(() => game.nextPlayer());
  }

  // ----------------------------------------
  // render
  // ----------------------------------------
  return (
    <div className="App">
      <header className=""></header>

      {game.teams.length > 0 && (
        <>
          <DataTable columns={columns} data={mappedGame} className="table" />

          {game.whosNext && <div>Next Player: {game.whosNext?.name}</div>}

          <div>
            <form onSubmit={submitCurrentTeamScore} ref={currentScoreForm}>
              <input type="number" name="score" min={0} max={12} />
              <button type="submit">Submit</button>
            </form>
          </div>

          <div>
            <button onClick={skipPlayer}>Skip Player</button>
          </div>
        </>
      )}

      <div>
        <div>New Team</div>
        <form onSubmit={submitNewTeam} ref={newTeamForm}>
          <input
            type="text"
            name="name"
            placeholder={`Team ${game.teams.length + 1}`}
          />
          <button type="submit">Submit</button>
        </form>
      </div>
      <div>
        <div>New Player</div>
        <form onSubmit={submitNewPlayer} ref={newPlayerForm}>
          <input type="text" name="name" placeholder="New Player Name" />
          <select name="team">
            {game.teams.map((team, index) => (
              <option value={index} key={index}>
                {team.name}
              </option>
            ))}
          </select>
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
}

export default App;
