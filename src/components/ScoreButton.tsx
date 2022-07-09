import { Button } from '@material-tailwind/react';
import React, { FunctionComponent } from 'react';
import { FaEllipsisH } from 'react-icons/fa';
import { runningTotalKey } from '../mapGame';
import { indexToTextColor } from './indexToColor';
import { Modal } from './Modal';
import { useModal } from './useModal';

export const ScoreButton: FunctionComponent<{}> = ({}) => {
  const { isOpen, openModal, closeModal } = useModal();

  return (
    <>
      <Button size="sm">
        <FaEllipsisH />
      </Button>
      <Modal>
        
      </Modal>
    </>
  );
};
