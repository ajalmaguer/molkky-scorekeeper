import {
  Button,
  Tab,
  TabPanel,
  Tabs,
  TabsBody,
  TabsHeader,
} from '@material-tailwind/react';
import { FunctionComponent } from 'react';
import { Player } from '../game';
import { Modal } from './Modal';
import { NewPlayerForm } from './NewPlayerForm';
import { useModal } from './useModal';

export const PlayerButton: FunctionComponent<{
  player: Player;
  onRename: (newName: string) => void;
  onDelete: () => void;
  isNext: boolean;
}> = ({ player, isNext, onRename: _onRename, onDelete }) => {
  const { isOpen, openModal, closeModal } = useModal();

  function onRename(newName: string) {
    closeModal();
    _onRename(newName);
  }

  return (
    <>
      <Button
        size="md"
        color={isNext ? 'yellow' : 'blue-grey'}
        variant={isNext ? 'filled' : 'outlined'}
        className="!rounded-lg !py-2 !px-4"
        onClick={openModal}
      >
        {player.name}
        {isNext && <span> 🦄</span>}
      </Button>

      <Modal isOpen={isOpen} onClose={closeModal} title={player.name}>
        <Tabs value="Rename" className="w-full">
          <TabsHeader>
            <Tab value="Rename">Rename</Tab>
            <Tab value="Settings">Settings</Tab>
          </TabsHeader>
          <TabsBody>
            <TabPanel value="Rename">
              <NewPlayerForm
                onChange={onRename}
                initialNameValue={player.name}
                resetFormOnSubmit={false}
              />
            </TabPanel>
            <TabPanel value="Settings">
              <div className="flex justify-center w-full">
                <Button
                  color="red"
                  onClick={() => {
                    // if (
                    //   confirm('Are you sure you want to delete this player?')
                    // ) {
                    onDelete();
                    closeModal();
                    // }
                  }}
                >
                  Delete Player
                </Button>
              </div>
            </TabPanel>
          </TabsBody>
        </Tabs>
      </Modal>
    </>
  );
};
