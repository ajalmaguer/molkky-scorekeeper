import { Button, Input } from '@material-tailwind/react';
import { FormEvent, FunctionComponent, useRef } from 'react';
import { Team } from '../game';

export const RenameTeamForm: FunctionComponent<{
  team: Team;
  onChange: (newName: string) => void;
}> = ({ team, onChange }) => {
  const formRef = useRef<HTMLFormElement>(null);
  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const formData = new FormData(e.target! as HTMLFormElement);
    const name = formData.get('name');

    onChange(name as string);
  }

  return (
    <form onSubmit={handleSubmit} ref={formRef}>
      <div className="mb-2">
        <Input
          size="lg"
          label="Edit Team Name"
          name="name"
          placeholder={`New Team Name`}
          defaultValue={team.name}
          autoFocus
          autoComplete="off"
        />
      </div>
      <div className="flex justify-center">
        <Button
          size="lg"
          type="submit"
          className="rounded-full"
          color="light-blue"
        >
          Submit
        </Button>
      </div>
    </form>
  );
};
