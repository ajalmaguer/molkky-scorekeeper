import { FunctionComponent } from 'react';
import { Player } from '../game';

export const PlayerButton: FunctionComponent<{
  player: Player;
  isNext: boolean;
}> = ({ player, isNext }) => {
  return (
    <>
      <span
        className={[
          'inline-block',
          'px-2',
          'line',
          'whitespace-nowrap',
          'transition-colors',
          'border border-gray-400 rounded-md',
          isNext ? 'border-emerald-700 bg-emerald-100' : '',
        ].join(' ')}
      >
        {player.name}
      </span>
    </>
  );
};

/** 
 * display: inline-block;
    padding: 0.25em 0.4em;
    font-size: 75%;
    font-weight: 700;
    line-height: 1;
    text-align: center;
    white-space: nowrap;
    vertical-align: baseline;
    border-radius: 0.25rem;
}
 * 
 */
