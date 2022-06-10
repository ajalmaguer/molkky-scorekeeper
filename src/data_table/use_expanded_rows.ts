import { useState } from 'react';
import { ExpandedRowsState } from './expanded_rows_state.interface';
import range from 'underscore/modules/range';

export function useExpandedRows(numberOfRows: number) {
  const [expandedRows, setExpandedRows] = useState<ExpandedRowsState>({});

  function handleRowToggle(rowIndex: number) {
    setExpandedRows({
      ...expandedRows,
      [rowIndex]: !expandedRows[rowIndex],
    });
  }

  function expandAllRows() {
    const newState = {};
    range(numberOfRows).forEach((i) => {
      newState[i] = true;
    });
    setExpandedRows(newState);
  }

  function collapseAllRows() {
    const newState = {};
    range(numberOfRows).forEach((i) => {
      newState[i] = false;
    });
    setExpandedRows(newState);
  }

  return { expandedRows, handleRowToggle, expandAllRows, collapseAllRows };
}
