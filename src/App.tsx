import { FormEvent, Fragment, useEffect, useRef, useState } from 'react';
import { FaEllipsisH } from 'react-icons/fa';
import './App.css';
import { NextPlayerScoreForm } from './components/NextPlayerScoreForm';
import { PlayerButton } from './components/PlayerButton';
import { TeamButton } from './components/TeamButton';
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
      className: 'p-2 border border-gray-500',
      header: '',
      content: (rowData) => {
        return (
          <span className="whitespace-nowrap">
            Round {rowData.roundIndex + 1}
          </span>
        );
      },
    },
  ];
  game.teams.forEach((team, teamIndex) => {
    columns.push({
      className: 'border border-gray-500 text-center py-4 px-2',
      header: (
        <>
          <div className="mb-2">
            <TeamButton team={team} />
            {/* <button
              onClick={() =>
                removeTeam({
                  teamIndex,
                  teamName: team.name,
                })
              }
            >
              🗑
            </button> */}
            {/* 
            
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
            </button> */}
          </div>
          <div style={{ whiteSpace: 'nowrap' }}>
            {team.players.map((player, playerIndex) => (
              <Fragment key={playerIndex}>
                <PlayerButton
                  player={player}
                  isNext={game.whosNext?.name === player.name}
                />
                {/* <button
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
                </button> */}
                {/* <button
                  onClick={() =>
                    renamePlayer({
                      teamIndex,
                      playerIndex,
                      newName: prompt(`New name for ${player.name}`),
                    })
                  }
                >
                  ✏️
                </button> */}
                {playerIndex !== team.players.length - 1 && <span> / </span>}
              </Fragment>
            ))}
          </div>
        </>
      ),
      content: (rowData) => {
        const score = rowData[team.name];
        return (
          <div className="whitespace-nowrap flex justify-center items-center">
            <div className="mr-3">
              {score} / {rowData[runningTotalKey(team.name)]}
            </div>

            <button
              className="border border-violet-300 px-2 py-1 rounded-full transition-colors active:bg-violet-200"
              onClick={() => {
                // editScore({
                //   teamIndex,
                //   scoreIndex: rowData.roundIndex,
                //   newScore: Number(prompt(`Old score: ${score}, New score:`)),
                // })
              }}
            >
              <FaEllipsisH />
            </button>
          </div>
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
  function submitCurrentTeamScore(score: number) {
    updateGame(() => game.submitScoreForCurrentTeam(score));
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
  // rendered sections
  // ----------------------------------------
  const dataTable = (
    <DataTable columns={columns} data={mappedGame} className="" />
  );

  const nextForm = (
    <div className="">
      {/* <div className=''></div> */}
      {game.whosNext && <div>Next Player: {game.whosNext?.name}</div>}

      <NextPlayerScoreForm onSubmit={submitCurrentTeamScore} />
    </div>
  );

  const [expand, setExpand] = useState(false);
  function handleExpand() {
    setExpand(!expand);
  }

  useEffect(() => {
    (document.querySelector('.outside') as any)?.style.setProperty(
      '--bottom-height',
      expand ? '200px' : '100px'
    );
  }, [expand]);

  // ----------------------------------------
  // render
  // ----------------------------------------
  return (
    <>
      <div className="outside">
        <div className="top">{dataTable}</div>
        <div className="bottom">
          <button onClick={handleExpand}>expand</button>
          {nextForm}
        </div>
      </div>
    </>
  );

  return (
    <div className="m-5">
      <header className=""></header>

      {game.teams.length > 0 && (
        <>
          <div className="overflow-x-scroll -mx-5 p-5">
            <DataTable columns={columns} data={mappedGame} className="table" />
          </div>

          <div className="border border-red fixed bottom-0 left-0 right-0 h-[100px] bg-white flex flex-col justify-center items-center">
            {game.whosNext && <div>Next Player: {game.whosNext?.name}</div>}

            <NextPlayerScoreForm onSubmit={submitCurrentTeamScore} />
          </div>

          {/* <div>
            <button onClick={skipPlayer}>Skip Player</button>
          </div> */}
        </>
      )}

      {/* <div>
        <div>New Team</div>
        <form onSubmit={submitNewTeam} ref={newTeamForm}>
          <input
            type="text"
            name="name"
            placeholder={`Team ${game.teams.length + 1}`}
          />
          <button type="submit">Submit</button>
        </form>
      </div> */}
      {/* <div>
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
      </div> */}
    </div>
  );
}

export default App;
