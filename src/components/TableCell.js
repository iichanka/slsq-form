import React                            from 'react';
import { Tooltip }                      from 'antd';

export const TableCell = ({ children, style, className, column, action, ...props}) => {
    let needPopOver = false;
    let width = 1;
    let length = 1;
    let classNameFinal = 'field-no-wrap';
    let styleFinal = { float: 'right' };
  
    if(style)
    {
      if(style.maxWidth)
      {
        let widthString = style.maxWidth.toString().replace('px', '');
        width = Number(widthString);
        styleFinal = {...styleFinal, width: style.maxWidth };
      }
      styleFinal = {...style, ...styleFinal };
    }
  
    if(column)
    {
      if(column.width)
      {
        styleFinal = {...styleFinal, maxWidth: column.width, width: column.width };
      }
    }
  
    if(children)
    {
        length = children.length;
    }
  
    if(className)
    {
      classNameFinal = `${className} ${classNameFinal}`;
    }
  
    if(action)
    {
      return children;
    }
  
    needPopOver = (width / length) < 10;
  
    if(needPopOver)
    {
      return(
        <div { ...props }
              style      = { styleFinal }
              className  = { classNameFinal } >
          <Tooltip 
            title     = { children }
            placement = 'topLeft' >
            <span style ={{ marginLeft: 5, marginRight: 5 }}>{ children }</span>
          </Tooltip>
        </div>
      );
    }
    return(
      <div  { ...props }
            style      = { styleFinal }
            className  = { classNameFinal }>
        <span style ={{ marginLeft: 5, marginRight: 5 }}>{ children }</span>
      </div>
    );
  }