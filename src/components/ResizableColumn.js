import React from 'react';
import { Resizable } from 'react-resizable';
import 'react-resizable/css/styles.css';
import { TableCell } from '.';

export const ResizableColumn = props => {
  const { onResize, width, children, ...restProps } = props;

  console.log('column!', props);

  let clearWidth = Number(width.toString().replace('px', ''));


  return (
    <Resizable
      width     = { clearWidth } 
      height    = { 0 } 
      onResize  = { onResize }>
      <th {...restProps}>
        <TableCell style = {{ maxWidht: width }}>
          { children }
        </TableCell>
      </th>
    </Resizable>
  );
};

export default ResizableColumn;