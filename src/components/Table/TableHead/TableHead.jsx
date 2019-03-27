import React from 'react';
import PropTypes from 'prop-types';
import { DataTable, Checkbox } from 'carbon-components-react';
import isNil from 'lodash/isNil';
import styled from 'styled-components';

import TableCellRenderer from '../TableCellRenderer/TableCellRenderer';

import ColumnHeaderRow from './ColumnHeaderRow/ColumnHeaderRow';
import FilterHeaderRow from './FilterHeaderRow/FilterHeaderRow';

const { TableHead: CarbonTableHead, TableRow, TableExpandHeader, TableHeader } = DataTable;

const propTypes = {
  /** Important table options that the head needs to know about */
  options: PropTypes.shape({
    hasRowExpansion: PropTypes.bool,
    hasRowSelection: PropTypes.bool,
    hasRowActions: PropTypes.bool,
  }),
  /** List of columns */
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      isSortable: PropTypes.bool,
      filter: PropTypes.shape({
        placeholderText: PropTypes.string,
        options: PropTypes.arrayOf(
          PropTypes.shape({
            id: PropTypes.string.isRequired,
            text: PropTypes.string.isRequired,
          })
        ),
      }),
    })
  ).isRequired,

  /** Current state of the table */
  tableState: PropTypes.shape({
    /** Which toolbar is currently active */
    activeBar: PropTypes.oneOf(['column', 'filter']),
    /** What's currently selected in the table? */
    selection: PropTypes.shape({
      isSelectAllIndeterminate: PropTypes.bool,
      isSelectAllSelected: PropTypes.bool,
    }).isRequired,
    /** What sorting is currently applied */
    sort: PropTypes.shape({ direction: PropTypes.string, column: PropTypes.string }).isRequired,
    /** What column ordering is currently applied to the table */
    ordering: PropTypes.arrayOf(
      PropTypes.shape({
        columnId: PropTypes.string.isRequired,
        /* Visibility of column in table, defaults to false */
        isHidden: PropTypes.bool,
      })
    ).isRequired,
    /** Optional list of applied column filters */
    filters: PropTypes.arrayOf(
      PropTypes.shape({
        columnId: PropTypes.string.isRequired,
        value: PropTypes.string.isRequired,
      })
    ),
  }).isRequired,
  actions: PropTypes.shape({
    onSelectAll: PropTypes.func,
    onChangeSort: PropTypes.func,
    onChangeOrdering: PropTypes.func,
    onApplyFilter: PropTypes.func,
  }).isRequired,
  /** lightweight  */
  lightweight: PropTypes.bool,
};

const defaultProps = {
  options: {},
  lightweight: false,
};

const StyledCarbonTableHead = styled(({ lightweight, ...others }) => (
  <CarbonTableHead {...others} />
))`
  &&& {
    ${props =>
      props.lightweight === 'true' && {
        backgroundColor: '#fff',
        borderBottom: '2px solid #305ba3',
      }}
  }
`;
const StyledCheckboxTableHeader = styled(TableHeader)`
  && {
    padding-left: 1rem;
    padding-bottom: 0.5rem;
    width: 2.5rem;
  }
`;

const TableHead = ({
  options,
  options: { hasRowExpansion, hasRowSelection },
  columns,
  tableState: {
    selection: { isSelectAllIndeterminate, isSelectAllSelected },
    sort,
    activeBar,
    ordering,
    filters,
  },
  actions: { onSelectAll, onChangeSort, onApplyFilter, onChangeOrdering },
  lightweight,
}) => {
  const filterBarActive = activeBar === 'filter';
  return (
    <StyledCarbonTableHead lightweight={`${lightweight}`}>
      <TableRow>
        {hasRowExpansion ? <TableExpandHeader /> : null}
        {hasRowSelection ? (
          <StyledCheckboxTableHeader>
            {/* TODO: Replace checkbox with TableSelectAll component when onChange bug is fixed
                    https://github.com/IBM/carbon-components-react/issues/1088 */}
            <Checkbox
              id="select-all"
              labelText="Select All"
              hideLabel
              indeterminate={isSelectAllIndeterminate}
              checked={isSelectAllSelected}
              onChange={() => onSelectAll(!isSelectAllSelected)}
            />
          </StyledCheckboxTableHeader>
        ) : null}
        {ordering.map(item => {
          const matchingColumnMeta = columns.find(column => column.id === item.columnId);
          const hasSort = sort && sort.columnId === matchingColumnMeta.id;

          return !item.isHidden ? (
            <TableHeader
              id={`column-${matchingColumnMeta.id}`}
              key={`column-${matchingColumnMeta.id}`}
              data-column={matchingColumnMeta.id}
              isSortable={matchingColumnMeta.isSortable}
              isSortHeader={hasSort}
              onClick={() => {
                if (matchingColumnMeta.isSortable && onChangeSort) {
                  onChangeSort(matchingColumnMeta.id);
                }
              }}
              sortDirection={hasSort ? sort.direction : 'NONE'}>
              <TableCellRenderer>{matchingColumnMeta.name}</TableCellRenderer>
            </TableHeader>
          ) : null;
        })}
        {options.hasRowActions ? <TableHeader>&nbsp;</TableHeader> : null}
      </TableRow>
      {filterBarActive && (
        <FilterHeaderRow
          columns={columns.map(column => ({
            ...column.filter,
            id: column.id,
            isFilterable: !isNil(column.filter),
          }))}
          ordering={ordering}
          key={JSON.stringify(filters)}
          filters={filters}
          tableOptions={options}
          onApplyFilter={onApplyFilter}
          lightweight={lightweight}
        />
      )}
      {activeBar === 'column' && (
        <ColumnHeaderRow
          columns={columns.map(column => ({
            id: column.id,
            name: column.name,
          }))}
          ordering={ordering}
          tableOptions={options}
          onChangeOrdering={onChangeOrdering}
          lightweight={lightweight}
        />
      )}
    </StyledCarbonTableHead>
  );
};

TableHead.propTypes = propTypes;
TableHead.defaultProps = defaultProps;

export default TableHead;