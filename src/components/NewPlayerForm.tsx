import { Button, Input } from '@material-tailwind/react';
import { FormEvent, FunctionComponent, useRef } from 'react';
import { Team } from '../game';

export const NewPlayerForm: FunctionComponent<{
  // team: Team;
  onChange: (name: string) => void;
}> = ({ onChange }) => {
  const formRef = useRef<HTMLFormElement>(null);
  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const formData = new FormData(e.target! as HTMLFormElement);
    const name = formData.get('name');

    onChange(name as string);

    formRef.current?.reset();
  }

  return (
    <form onSubmit={handleSubmit} ref={formRef}>
      <div className="mb-2">
        <Input size="lg" label="Player Name" name="name" autoFocus />
      </div>
      <div className="flex justify-center">
        <Button
          size="lg"
          type="submit"
          className="rounded-full"
          color="light-blue"
          defaultValue=""
        >
          Submit
        </Button>
      </div>
    </form>
  );
};
