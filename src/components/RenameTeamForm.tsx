import { Button } from '@material-tailwind/react';
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

    // formRef.current?.reset();
  }

  return (
    <form onSubmit={handleSubmit} ref={formRef}>
      <input
        className="transition-all border border-indigo-400 focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-lg p-2 mb-2"
        type="text"
        name="name"
        placeholder={`New Team Name`}
        defaultValue={team.name}
        autoFocus
      />
      <div className="flex justify-end">
        {/* <button
          className={[
            'h-10 px-6 font-semibold rounded-full  text-white',
            'whitespace-nowrap',
            'transition-colors bg-violet-600 active:bg-violet-400',
          ].join(' ')}
          type="submit"
        >
          Submit
        </button> */}
        <Button size="lg" type="submit" className="rounded-full">
          Submit
        </Button>
      </div>
    </form>
  );
};
