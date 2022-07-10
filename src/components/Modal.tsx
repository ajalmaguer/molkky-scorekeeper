import {
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
} from '@material-tailwind/react';
import { FunctionComponent, ReactNode } from 'react';

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
    </Dialog>
  );
};
