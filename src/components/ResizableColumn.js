import React from 'react';
import { Resizable } from 'react-resizable';
import 'react-resizable/css/styles.css';

export const ResizableColumn = props => {
  const { onResize, width, ...restProps } = props;

  console.log('column!');

  return (
    <Resizable
      width     = { width } 
      height    = { 0 } 
      onResize  = { onResize }>
      <th {...restProps} />
    </Resizable>
  );
};

export default ResizableColumn;