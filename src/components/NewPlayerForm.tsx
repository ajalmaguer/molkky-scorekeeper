import { Button, Input } from '@material-tailwind/react';
import { FormEvent, FunctionComponent, useRef } from 'react';

export const NewPlayerForm: FunctionComponent<{
  initialNameValue?: string;
  onChange: (name: string) => void;
  resetFormOnSubmit?: boolean;
}> = ({ initialNameValue = '', onChange, resetFormOnSubmit = true }) => {
  const formRef = useRef<HTMLFormElement>(null);
  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const formData = new FormData(e.target! as HTMLFormElement);
    const name = formData.get('name');

    onChange(name as string);

    if (resetFormOnSubmit) {
      formRef.current?.reset();
    }
  }

  return (
    <form onSubmit={handleSubmit} ref={formRef}>
      <div className="mb-2">
        <Input
          size="lg"
          label="Player Name"
          name="name"
          defaultValue={initialNameValue}
          autoFocus
          required
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
