import React, { FunctionComponent } from 'react';

export const SortableHeader: FunctionComponent<{
  onToggleSort: () => void;
  direction: 'asc' | 'desc' | null;
  children: React.ReactNode;
}> = ({ onToggleSort, direction, children }) => {
  let icon = <></>;
  switch (direction) {
    case 'asc':
      icon = <i className="fern-icon-caret-up"></i>;
      break;
    case 'desc':
      icon = <i className="fern-icon-caret-down"></i>;
      break;
    default:
      icon = <i className="fern-icon-minus"></i>;
      break;
  }

  return (
    <button
      style={{ width: '100%' }}
      className="fern-body-bold fern-text-no-wrap"
      onClick={onToggleSort}
    >
      {children} <span style={{ fontSize: 10 }}>{icon}</span>
    </button>
  );
};
