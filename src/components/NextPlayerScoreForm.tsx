import React, { FormEvent, FunctionComponent, useRef } from 'react';

export const NextPlayerScoreForm: FunctionComponent<{
  onSubmit: (score: number) => void;
}> = ({ onSubmit }) => {
  const currentScoreForm = useRef<HTMLFormElement>(null);
  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const formData = new FormData(e.target! as HTMLFormElement);
    const score = Number(formData.get('score'));
    if (typeof score !== 'number' || isNaN(score)) {
      console.log('score is not a number');
      return;
    }
    onSubmit(score);
    currentScoreForm.current?.reset();
  }

  return (
    
      <form onSubmit={handleSubmit} ref={currentScoreForm}>
        <input type="number" name="score" min={0} max={12} />
        <button type="submit">Submit</button>
      </form>
    
  );
};
