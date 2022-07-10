import { Button, Progress } from '@material-tailwind/react';
import { useRef, useState } from 'react';
import './App.css';
import {
  indexToButtonColor,
  indexToTextColor,
} from './components/indexToColor';
import { PlayerButton } from './components/PlayerButton';
import { NewScoreForm } from './components/ScoreForms';
import { TeamButton } from './components/TeamButton';
import { Column, DataTable } from './data_table';

import { ScoreButton } from './components/ScoreButton';
import { LocalStorageService } from './localStorageService';
import { GameDataRow, mapGame, runningTotalKey } from './mapGame';
import useWindowDimensions from './components/useWindowDimensions';

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
      className: 'p-2',
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
      className: 'text-center py-4 px-2',
      header: (
        <div className="">
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
          <div className="flex flex-wrap gap-3 justify-center min-w-[200px] mb-4">
            {team.players.map((player, playerIndex) => (
              <div key={playerIndex}>
                <PlayerButton
                  player={player}
                  isNext={
                    game.whosNext?.name === player.name &&
                    game.currentTeamIndex === teamIndex
                  }
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
          <div>
            {team.totalScore === 50 ? (
              <>
                <div>🎉🥳 50 Points! 🎊🦄</div>
              </>
            ) : (
              <>
                <div>
                  {50 - team.totalScore} to win
                  <Progress
                    value={(team.totalScore / 50) * 100}
                    color={indexToButtonColor(teamIndex)}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      ),
      content: (rowData) => {
        const score = rowData[team.name];
        return (
          <div className="whitespace-nowrap flex justify-center items-center">
            <div
              className={['mr-3', indexToTextColor(rowData.roundIndex)].join(
                ' '
              )}
            >
              {score} / {rowData[runningTotalKey(team.name)]}
            </div>
            <ScoreButton
              score={score}
              onEdit={(newScore) => {
                editScore({
                  teamIndex,
                  scoreIndex: rowData.roundIndex,
                  newScore,
                });
              }}
              indexForButton={rowData.roundIndex}
            />
          </div>
        );
      },
    });
  });
  columns.push({
    className: 'text-center py-4 px-2',
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
    <div className="p-3">
      {game.whosNext && (
        <div className="mb-2">Next Player: {game.whosNext?.name}</div>
      )}

      <NewScoreForm
        onSubmit={submitCurrentTeamScore}
        teamIndex={game.currentTeamIndex}
      />
    </div>
  );

  const { height } = useWindowDimensions();
  const ref = useRef<HTMLDivElement>(null);
  const maxHeight = `calc(${height}px - ${ref.current?.clientHeight || 100}px)`;

  // ----------------------------------------
  // render
  // ----------------------------------------
  return (
    <>
      <div className="outside">
        <div className="top" style={{ maxHeight }}>
          <div className="table-container">{dataTable}</div>
        </div>
        <div className="bottom" ref={ref}>
          {nextForm}
        </div>
      </div>
    </>
  );
}

export default App;
