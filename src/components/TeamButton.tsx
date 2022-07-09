import {
  Button,
  Tab,
  TabPanel,
  Tabs,
  TabsBody,
  TabsHeader,
} from '@material-tailwind/react';
import { FunctionComponent, useRef, useState } from 'react';
import { Team } from '../game';
import { Modal } from './Modal';
import { RenameTeamForm } from './RenameTeamForm';

export const TeamButton: FunctionComponent<{
  team: Team;
  onRename: (newName: string) => void;
  onDelete: () => void;
}> = ({ team, onRename, onDelete }) => {
  const [isOpen, setIsOpen] = useState(false);
  function openModal() {
    setIsOpen(true);
  }
  function closeModal() {
    setIsOpen(false);
  }

  const firstTab = useRef(null);

  return (
    <>
      <Button
        size="lg"
        onClick={openModal}
        color="pink"
        variant="gradient"
        className="whitespace-nowrap"
      >
        {team.name}
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        title={<div className="text-3xl mb-5">{team.name}</div>}
        description={<></>}
        initialFocus={firstTab}
      >
        <Tabs value="Rename Team">
          <TabsHeader>
            <Tab value="Rename Team">Rename Team</Tab>
            <Tab value="Delete Team">Delete Team</Tab>
          </TabsHeader>
          <TabsBody>
            <TabPanel value="Rename Team">
              <RenameTeamForm team={team} onChange={onRename} />
            </TabPanel>
            <TabPanel value="Delete Team">
              <div className="flex justify-center">
                <Button color="red" onClick={onDelete}>
                  Click to delete - there's no going back!
                </Button>
              </div>
            </TabPanel>
          </TabsBody>
        </Tabs>
      </Modal>
    </>
  );
};
