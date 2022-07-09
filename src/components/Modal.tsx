import { Dialog } from '@headlessui/react';
import { FunctionComponent, ReactNode } from 'react';
import { CgCloseO as CloseIcon } from 'react-icons/cg';

export const Modal: FunctionComponent<{
  isOpen: boolean;
  onClose: () => void;
  title: ReactNode;
  description: ReactNode;
  children: ReactNode;
  initialFocus: any;
}> = ({ isOpen, onClose, title, description, children, initialFocus }) => {
  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="relative z-50"
      initialFocus={initialFocus}
    >
      <div className="fixed inset-0 bg-black/30" aria-hidden="true">
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-sm rounded bg-white relative p-3">
            <Dialog.Title>{title}</Dialog.Title>
            <Dialog.Description>{description}</Dialog.Description>
            <button
              className="absolute top-2 right-2"
              title="Close"
              onClick={onClose}
            >
              <CloseIcon className="text-2xl text-gray-700 fill-current" />
            </button>
            {children}
          </Dialog.Panel>
        </div>
      </div>
    </Dialog>
  );
};
