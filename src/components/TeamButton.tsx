import { FunctionComponent } from 'react';
import { Team } from '../game';

export const TeamButton: FunctionComponent<{ team: Team }> = ({ team }) => {
  return (
    <>
      <button
        className={[
          'h-10 px-6 font-semibold rounded-full  text-white',
          'whitespace-nowrap',
          'transition-colors bg-violet-600 active:bg-violet-400',
        ].join(' ')}
      >
        {team.name}
      </button>
    </>
  );
};
