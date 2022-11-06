import { Dialog, DialogBody, DialogHeader } from '@material-tailwind/react';
import { FunctionComponent, ReactNode } from 'react';
import { AiFillCloseCircle } from 'react-icons/ai';

export const Modal: FunctionComponent<{
  isOpen: boolean;
  onClose: () => void;
  title: ReactNode;
  children: ReactNode;
  size?: 'xl' | 'xxl';
}> = ({ isOpen, onClose, title, children, size = 'xl' }) => {
  return (
    <Dialog
      open={isOpen}
      handler={onClose}
      className="relative z-50"
      size={size}
    >
      <DialogHeader>{title}</DialogHeader>
      <DialogBody>{children}</DialogBody>
      <button onClick={onClose} className="absolute top-4 right-4 text-xl">
        <AiFillCloseCircle />
      </button>
    </Dialog>
  );
};
