import { FunctionComponent } from 'react';
import { indexToBgColor, indexToButtonColor } from './indexToColor';

export type Summary = {
  name: string;
  totalScore: number;
  toWin: number;
  teamIndex: number;
};

export const SummaryChip: FunctionComponent<{
  summary: Summary;
}> = ({ summary }) => {
  return (
    <div
      className={[
        'text-xs text-center px-2 py-1 rounded-lg text-white',
        indexToBgColor(summary.teamIndex),
      ].join(' ')}
    >
      <div className="whitespace-nowrap">{summary.name}</div>
      <div>{summary.totalScore}</div>
      <div className="whitespace-nowrap">{summary.toWin} to win</div>
    </div>
  );
};
