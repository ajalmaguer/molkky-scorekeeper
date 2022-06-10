import React from 'react';
import { ExpandedRowsState } from './expanded_rows_state.interface';

export interface ConditionalRowStyle<T> {
  when: (rowData: T, rowIndex: number) => boolean;
  className: string;
}

export interface Column<T> {
  header: React.ReactNode;
  content: (rowData: T, rowIndex: number) => React.ReactNode;
  className?: string;
}

/**
 * This is a simple data table. Originally built to handle the ops/summary table.
 *
 * @param conditionalRowStyles any condition that returns true will add that condition's class to the row so a row can have 0 to many css classes on them depending on the conditional row styles. (Remember css is compositional by design)
 * @param ExpandableRowContent this is a component you pass in if you want rows to have expandable content. Remember components are just functions that are Title Case.
 * @param expandedRows this is the state for which rows are open/closed (use the useExpandedRows hook for this)
 */
export function DataTable<T>({
  columns,
  data,
  conditionalRowStyles = [],
  className = '',
  expandedRowContent,
  expandedRows = {},
}: {
  columns: Column<T>[];
  data: T[];
  conditionalRowStyles?: ConditionalRowStyle<T>[];
  className?: string;
  expandedRowContent?: (rowData: T, rowIndex: number) => React.ReactNode;
  expandedRows?: ExpandedRowsState;
}): React.ReactElement {
  function mapStyles(rowData: T, rowIndex: number): string {
    const output: string[] = [];
    conditionalRowStyles.forEach((style) => {
      if (style.when(rowData, rowIndex)) {
        output.push(style.className);
      }
    });

    return output.join(' ');
  }

  return (
    <>
      <table className={`fern-data-table ${className}`}>
        <thead>
          <tr>
            {columns.map((col, i) => (
              <th key={i} className={col.className ?? ''}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((rowData, i) => (
            <React.Fragment key={i}>
              <tr className={mapStyles(rowData, i)}>
                {columns.map((col, j) => (
                  <td key={j} className={col.className ?? ''}>
                    {col.content(rowData, i)}
                  </td>
                ))}
              </tr>

              {expandedRowContent && expandedRows[i] && (
                <tr>
                  <td colSpan={columns.length}>
                    {expandedRowContent(rowData, i)}
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </>
  );
}
