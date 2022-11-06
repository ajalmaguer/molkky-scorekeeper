import {
  Button,
  Tab,
  TabPanel,
  Tabs,
  TabsBody,
  TabsHeader,
} from '@material-tailwind/react';
import { FunctionComponent, useState } from 'react';
import { AiFillCloseCircle, AiOutlineCloseCircle } from 'react-icons/ai';
import { Team } from '../game';
import { indexToButtonColor } from './indexToColor';
import { Modal } from './Modal';
import { NewPlayerForm } from './NewPlayerForm';
import { RenameTeamForm } from './RenameTeamForm';
import { useModal } from './useModal';

export const TeamButton: FunctionComponent<{
  team: Team;
  onRename: (newName: string) => void;
  onDelete: () => void;
  teamIndex: number;
  onAddPlayer: (playerName: string) => void;
}> = ({
  team,
  onRename: _onRename,
  onDelete,
  teamIndex,
  onAddPlayer: _onAddPlayer,
}) => {
  const { isOpen, openModal, closeModal: _closeModal } = useModal();
  function closeModal() {
    resetNotification();
    _closeModal();
  }
  const [notification, setNotification] = useState('');
  function resetNotification() {
    setNotification('');
  }

  function onAddPlayer(playerName: string) {
    setNotification(`Player added: ${playerName}`);
    _onAddPlayer(playerName);
  }

  function onRename(newName: string) {
    closeModal();
    _onRename(newName);
  }

  return (
    <>
      <Button
        size="lg"
        onClick={openModal}
        color={indexToButtonColor(teamIndex)}
        variant="gradient"
        className="whitespace-nowrap"
      >
        {team.name}
      </Button>

      <Modal isOpen={isOpen} onClose={closeModal} title={team.name}>
        <div className="w-full">
          <Tabs value="Add Player">
            <TabsHeader>
              <Tab value="Add Player">Add Player</Tab>
              <Tab value="Settings">Settings</Tab>
            </TabsHeader>
            <TabsBody>
              <TabPanel value="Add Player">
                <NewPlayerForm onChange={onAddPlayer} />
                {notification && (
                  <div
                    className={[
                      'p-2',
                      'border border-light-green-500 rounded-lg',
                      'bg-light-green-50',
                      'flex justify-between items-center',
                      'mt-5',
                    ].join(' ')}
                  >
                    {notification}
                    <AiFillCloseCircle onClick={resetNotification} />
                  </div>
                )}
              </TabPanel>
              <TabPanel value="Settings">
                <RenameTeamForm team={team} onChange={onRename} />
                <hr className="my-5 border-grey-300" />
                <div className="flex justify-center ">
                  <Button
                    color="red"
                    onClick={() => {
                      if (
                        confirm('Are you sure you want to delete this team?')
                      ) {
                        onDelete();
                        closeModal();
                      }
                    }}
                  >
                    Delete Team
                  </Button>
                </div>
              </TabPanel>
            </TabsBody>
          </Tabs>
        </div>
      </Modal>
    </>
  );
};
