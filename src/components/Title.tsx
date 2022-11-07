import { Button } from '@material-tailwind/react';
import React, { FunctionComponent } from 'react';
import {
  AiFillCloseCircle,
  AiFillSetting,
  AiOutlineQuestionCircle as InfoIcon,
} from 'react-icons/ai';
import { Modal } from './Modal';
import { useModal } from './useModal';

export const Title: FunctionComponent<{
  onReset: () => void;
  onResetScoresForNextGame: () => void;
}> = (props) => {
  const infoModal = useModal();
  const settingsModal = useModal();

  function onResetScoresForNextGame() {
    if (confirm('Are you sure you want to start a new game?')) {
      props.onResetScoresForNextGame();
      settingsModal.closeModal();
    }
  }
  function onReset() {
    if (
      confirm(
        'Are you sure you want to clear out all teams and players? This cannot be undone.'
      )
    ) {
      props.onReset();
      settingsModal.closeModal();
    }
  }

  return (
    <>
      <div className="flex justify-between items-center m-3">
        <div className="basis-5">
          <button
            className="basis-5 text-xl transition-colors fill-current text-pink-500 active:text-pink-900"
            onClick={settingsModal.openModal}
          >
            <AiFillSetting />
          </button>
        </div>
        <h1 className="text-2xl">Mölkky Score Keeper</h1>
        <button
          className="basis-5 text-xl transition-colors fill-current text-indigo-500 active:text-indigo-900"
          onClick={infoModal.openModal}
        >
          <InfoIcon />
        </button>
      </div>

      <Modal
        isOpen={settingsModal.isOpen}
        onClose={settingsModal.closeModal}
        title={'Game Settings'}
      >
        <div className="flex flex-col gap-10 justify-center items-center w-full">
          <Button color="green" onClick={onResetScoresForNextGame}>
            Another game!
          </Button>

          <Button color="red" onClick={onReset}>
            Reset Everything
          </Button>
        </div>
      </Modal>

      <Modal
        isOpen={infoModal.isOpen}
        onClose={infoModal.closeModal}
        title={'How to play'}
        size="xxl"
      >
        <div
          className="text-blue-grey-800 prose overflow-y-auto"
          style={{ maxHeight: 'calc(100vh - 100px)' }}
        >
          <button
            onClick={infoModal.closeModal}
            className="fixed top-4 right-4 text-xl"
          >
            <AiFillCloseCircle />
          </button>
          <p>
            <strong>Beginning the game:</strong> First player throws underhand
            at the grouping and tries to knock over pins.
          </p>

          <p>
            <strong>Fallen pin(s):</strong> After a throw, fallen pins pins are
            put upright at the place where they fell.
          </p>

          <p>
            <strong>Scoring:</strong> If one pin falls, the score is equal to
            the number on the pin. When more than one pin falls, the score is
            equal to the number of fallen pins.
          </p>

          <p>
            <strong>Ending the game:</strong> The game ends when the first
            player reaches exactly 50 points. If one score is over 50, that
            player's scroe is lowered to 25.
          </p>

          <small>
            Made by{' '}
            <a
              href="https://github.com/ajalmaguer"
              target="_blank"
              rel="noopener noreferrer"
            >
              AJ
            </a>{' '}
            (
            <a
              href="https://github.com/ajalmaguer/molkky-scorekeeper"
              target="_blank"
              rel="noopener noreferrer"
            >
              source code
            </a>
            ) . Inspired by my friends, who taught me how to play this game
            during our regular field days. One day, they made me keep score (and
            do math in my head 😮) so I built this little app to keep score for
            me (and to save 🌲🌲🌲 too I guess).
          </small>
        </div>
      </Modal>
    </>
  );
};
