import { Button, Input } from '@material-tailwind/react';
import { FormEvent, FunctionComponent, ReactNode, useRef } from 'react';
import { indexToButtonColor } from './indexToColor';

const ScoreForm: FunctionComponent<{
  onSubmit: (score: number) => void;
  children: ReactNode;
}> = ({ onSubmit, children }) => {
  const currentScoreForm = useRef<HTMLFormElement>(null);
  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const formData = new FormData(e.target! as HTMLFormElement);
    const score = Number(formData.get('score'));
    if (typeof score !== 'number' || isNaN(score)) {
      return;
    }
    onSubmit(score);

    currentScoreForm.current?.reset();
  }

  return (
    <form onSubmit={handleSubmit} ref={currentScoreForm}>
      {children}
    </form>
  );
};

export const EditScoreForm: FunctionComponent<{
  onSubmit: (score: number) => void;
  initialScore: number;
}> = ({ initialScore, onSubmit }) => {
  return (
    <>
      <ScoreForm onSubmit={onSubmit}>
        <div className="mb-2">
          <Input
            type="number"
            name="score"
            label="Score"
            min={0}
            max={12}
            defaultValue={initialScore}
            autoFocus
            required
          />
        </div>
        <div className="flex justify-center">
          <Button type="submit">Submit</Button>
        </div>
      </ScoreForm>
    </>
  );
};

export const NewScoreForm: FunctionComponent<{
  onSubmit: (score: number) => void;
  teamIndex: number;
}> = ({ onSubmit, teamIndex }) => {
  return (
    <>
      <ScoreForm onSubmit={onSubmit}>
        <div className="flex gap-2">
          <div className="flex-grow">
            <Input
              type="number"
              name="score"
              label="Score"
              size="lg"
              min={0}
              max={12}
              required
            />
          </div>
          <Button type="submit" color={indexToButtonColor(teamIndex)}>
            Submit
          </Button>
        </div>
      </ScoreForm>
    </>
  );
};
