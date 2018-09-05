import React                            from 'react';
import { Button }                       from 'antd';
import { store }                        from '../../index';
import { deletePositions }              from '../../actions/positions/deletePositions'

export const ActionCell = ({ data, editMode }) => {
  return(
    <div>
      {
        data.actions.delete && editMode &&
        <Button
          size      = 'small' 
          icon      = 'delete'
          className = 'field-no-wrap'
          onClick   = { (e) => { store.dispatch(deletePositions([data])) } }
        /> 
      }
      {
        data.actions.autodelivery &&
        <Button
          size      = 'small'
          icon      = 'car'
          className = 'field-no-wrap'
          onClick   = { (e) => { alert('В разработке'); } }
        />
      }
    </div>
  );   
}

export default ActionCell;