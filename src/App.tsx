import { Button } from '@material-tailwind/react';
import { useEffect, useRef, useState } from 'react';
import { FaEllipsisH } from 'react-icons/fa';
import './App.css';
import {
  indexToButtonColor,
  indexToTextColor,
} from './components/indexToColor';
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
      content: (rowData, index) => {
        return (
          <span
            className={['whitespace-nowrap', indexToTextColor(index)].join(' ')}
          >
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
          <div className="mb-4">
            <TeamButton
              teamIndex={teamIndex}
              team={team}
              onRename={(newName) => {
                renameTeam({ teamIndex, newName });
              }}
              onDelete={() => removeTeam({ teamIndex })}
              onAddPlayer={(playerName) =>
                createNewPlayer({ teamIndex, playerName })
              }
            />
          </div>
          <div className="flex flex-wrap gap-3 justify-center min-w-[200px]">
            {team.players.map((player, playerIndex) => (
              <div key={playerIndex}>
                <PlayerButton
                  player={player}
                  isNext={game.whosNext?.name === player.name}
                  onRename={(newName) =>
                    renamePlayer({ teamIndex, playerIndex, newName })
                  }
                  onDelete={() => {
                    removePlayer({ teamIndex, playerIndex });
                  }}
                />
              </div>
            ))}
          </div>
        </>
      ),
      content: (rowData, teamIndex) => {
        const score = rowData[team.name];
        return (
          <div className="whitespace-nowrap flex justify-center items-center">
            <div className={['mr-3', indexToTextColor(teamIndex)].join(' ')}>
              {score} / {rowData[runningTotalKey(team.name)]}
            </div>
            <Button size="sm">
              <FaEllipsisH />
            </Button>
          </div>
        );
      },
    });
  });
  columns.push({
    className: 'border border-gray-500 text-center py-4 px-2',
    header: (
      <>
        <Button
          className="whitespace-nowrap"
          color={indexToButtonColor(game.teams.length)}
          onClick={() => {
            const newTeamName = prompt('New Team Name (optional)');
            submitNewTeam(newTeamName);
          }}
        >
          Add a Team
        </Button>
      </>
    ),
    content: () => <></>,
  });

  // ----------------------------------------
  // add/remove teams
  // ----------------------------------------
  function submitNewTeam(name: string | null) {
    updateGame(() => game.addTeam(name || `Team ${game.teams.length + 1}`));
  }

  function removeTeam({ teamIndex }: { teamIndex: number }) {
    updateGame(() => game.removeTeam(teamIndex));
  }

  function renameTeam({
    teamIndex,
    newName,
  }: {
    teamIndex: number;
    newName: string | null;
  }) {
    if (!newName) {
      return;
    }
    updateGame(() => game.teams[teamIndex].updateName(newName));
  }

  // ----------------------------------------
  // add/remove players
  // ----------------------------------------
  function createNewPlayer({
    teamIndex,
    playerName,
  }: {
    teamIndex: number;
    playerName: string;
  }) {
    updateGame(() => game.teams[teamIndex].addPlayer(playerName));
  }

  function removePlayer({
    teamIndex,
    playerIndex,
  }: {
    teamIndex: number;
    playerIndex: number;
  }) {
    updateGame(() => {
      game.teams[teamIndex].removePlayer(playerIndex);
    });
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
