import React                            from 'react';
import PropTypes                        from 'prop-types';
import { Button }                       from 'antd';
import { store }                        from '../../index';
import { deletePositions }              from '../../actions/positions/deletePositions'

export class ActionCell extends React.Component {
  static propTypes = { 
    editMode:         PropTypes.bool.isRequired,    // режим редактирования?
    data:             PropTypes.object.isRequired,  //record таблицы позиций
  }


  onAutodeliveryClick = (event) => {
    //getAutodeliveryDetails
    //showPopup
  }
  
  render = () => {
    return(
      <div>
        {
          this.props.data.actions.delete && this.props.editMode &&
          <Button
            size      = 'small' 
            icon      = 'delete'
            className = 'field-no-wrap'
            onClick   = { (e) => { store.dispatch(deletePositions([this.props.data])) } }
          /> 
        }
        {
          this.props.data.actions.autodelivery &&
          <Button
            size      = 'small'
            icon      = 'car'
            className = 'field-no-wrap'
            onClick   = { this.onAutodeliveryClick }
          />
        }
      </div>
    );   
  } 
}

export default ActionCell;