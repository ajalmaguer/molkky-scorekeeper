import {
  Button,
  Tab,
  TabPanel,
  Tabs,
  TabsBody,
  TabsHeader,
} from '@material-tailwind/react';
import { FunctionComponent } from 'react';
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
}> = ({ team, onRename, onDelete, teamIndex, onAddPlayer }) => {
  const { isOpen, openModal, closeModal } = useModal();

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
        <Tabs value="Add Player">
          <TabsHeader>
            <Tab value="Add Player">Add Player</Tab>
            <Tab value="Settings">Settings</Tab>
          </TabsHeader>
          <TabsBody>
            <TabPanel value="Add Player">
              <NewPlayerForm onChange={onAddPlayer} />
            </TabPanel>
            <TabPanel value="Settings">
              <RenameTeamForm team={team} onChange={onRename} />
              <hr className="my-5 border-grey-300" />
              <div className="flex justify-center ">
                <Button
                  color="red"
                  onClick={() => {
                    // if (confirm('Are you sure you want to delete this team?')) {
                    onDelete();
                    closeModal();
                    // }
                  }}
                >
                  Delete Team
                </Button>
              </div>
            </TabPanel>
          </TabsBody>
        </Tabs>
      </Modal>
    </>
  );
};
