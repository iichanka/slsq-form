import React        from 'react';
import { Tooltip }  from 'antd';

export const FixedHeader = props => {
  const { width, title, children, ...restProps } = props;

  let clearWidth = 200;
  if(width)
  {
    clearWidth = width.toString().replace('px', '');
  }
  
  clearWidth -= 5;

  if(children.props.children[1])
  {
    clearWidth -= 22;
  }

  if(children.props.children[2])
  {
    clearWidth -= 22;
  }

  clearWidth = clearWidth + 'px';
  
  return (
    <th { ...restProps }>
      <Tooltip 
        title     = { title }
        placement = 'topLeft' >
        <div style = {{ display: 'flex' }}>
          <div style = {{ maxWidth: clearWidth, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', textAlign: 'left', marginLeft: '5px', flex: 1}}>
            { children.props.children[0] }
          </div>
          {
            children.props.children[1] !== undefined &&
            <div style = {{ width: 22 }}>
              { children.props.children[1] }
            </div>
          }
          {
            children.props.children[2] !== undefined &&
            <div style = {{ width: 22 }}>
              { children.props.children[2] }
            </div>
          }
        </div>
      </Tooltip>
    </th>
  );

/*   const { width, title, ...restProps } = props;
 
  return (
    <Tooltip 
      title     = { title }
      placement = 'topLeft' >
      <th { ...restProps } style = {{ maxWidth: width, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} />
    </Tooltip>
  ); */
};

export default FixedHeader;