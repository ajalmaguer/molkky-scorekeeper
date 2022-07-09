import { Dialog, DialogBody, DialogHeader } from '@material-tailwind/react';
import { FunctionComponent, ReactNode } from 'react';

export const Modal: FunctionComponent<{
  isOpen: boolean;
  onClose: () => void;
  title: ReactNode;
  children: ReactNode;
}> = ({ isOpen, onClose, title, children }) => {
  return (
    <Dialog open={isOpen} handler={onClose} className="relative z-50" size="xl">
      <DialogHeader>{title}</DialogHeader>
      <DialogBody>{children}</DialogBody>
    </Dialog>
  );
};
