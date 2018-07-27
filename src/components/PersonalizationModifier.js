import React                            from 'react';
import ReactDragListView                from 'react-drag-listview/lib';

export const PersonalizationModifier = ( {isPersonalizationActive, components, children, ...props}) => {
  if(isPersonalizationActive)
  {
    return(
      <ReactDragListView.DragColumn {...props}>
        { React.cloneElement(children, { components: components }) }
      </ReactDragListView.DragColumn>
    );
  }
  return children;  
}

export default PersonalizationModifier;