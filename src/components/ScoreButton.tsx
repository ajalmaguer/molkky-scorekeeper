import { Button } from '@material-tailwind/react';
import { FunctionComponent } from 'react';
import { FaEllipsisH } from 'react-icons/fa';
import { EditScoreForm } from './ScoreForms';
import { Modal } from './Modal';
import { useModal } from './useModal';
import { indexToButtonColor } from './indexToColor';

export const ScoreButton: FunctionComponent<{
  score: number;
  onEdit: (newScore: number) => void;
  indexForButton: number;
}> = ({ score, onEdit, indexForButton }) => {
  const { isOpen, openModal, closeModal } = useModal();

  return (
    <>
      <Button
        size="sm"
        onClick={openModal}
        color={indexToButtonColor(indexForButton)}
      >
        <FaEllipsisH />
      </Button>
      <Modal isOpen={isOpen} onClose={closeModal} title="Edit Score">
        <div className="w-full">
          <EditScoreForm
            initialScore={score}
            onSubmit={(newScore) => {
              onEdit(newScore);
              closeModal();
            }}
          />
        </div>
      </Modal>
    </>
  );
};
