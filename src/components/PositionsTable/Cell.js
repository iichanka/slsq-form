import React                            from 'react';
import PropTypes                        from 'prop-types';
import { Tooltip, Select, Input }              from 'antd';
import { store }                        from '../../index';
import { updatePositions }              from '../../actions/positions/updatePositions';
import { localUpdateItem }              from '../../actions/positions/main';

const Option = Select.Option;

const SelectRender = (props) => {
  const { fixedValues, children, align, width } = props;

  let title = children;
  let placement = align === 'left' ? 'topLeft' : 'topRight';

  let fixedValue = fixedValues.find(fixedVal => fixedVal.value === children);
  if(fixedValue)
  {
    title = fixedValue.title;
  }

  return(
    <Tooltip 
      title     = { title }
      placement = { placement } >
      <div 
        className = 'field-no-wrap'
        style     = {{ textAlign: align, maxWidth: width}}>
        { title }
      </div>
    </Tooltip>
  );
}

const DefaultRender = (props) => {
  const { children, align, width } = props;

  let placement = align === 'left' ? 'topLeft' : 'topRight';

  return(
    <Tooltip 
      title     = { children }
      placement = { placement } >
      <div 
        className = 'field-no-wrap'
        style     = {{ textAlign: align, maxWidth: width}}>
        { children }
      </div>
    </Tooltip>
  );
}

const DefaultRenderEditable = (props) => {
  const { children, align, width, isBlocked } = props;

  let placement = align === 'left' ? 'topLeft' : 'topRight';

  return(
    <Tooltip 
      title     = { children }
      placement = { placement } >
      <div 
        className = 'field-no-wrap'
        style     = {{ maxWidth: width}}>
        <Input 
          style    = { { textAlign: align } }
          onChange = { (e) => { props.onLocalChange(e.target.value) } }
          onBlur   = { props.onBlur }
          onPressEnter = { (e) => { props.onBlur(); } }
          value    = { children }
          size     = 'small' 
          disabled = { isBlocked } />
      </div>
    </Tooltip>
  );
}

const SelectRenderEditable = (props) => {
  const { fixedValues, children, align, width } = props;

  return(
    <Select         
      showSearch
      style             = {{ width, textAlign: align }}
      optionFilterProp  = "children"
      onSelect          = { (newValue, option) => { props.onFieldChange(newValue); } } 
      onChange          = { (val) => { props.onLocalChange(val) } }
      onBlur            = { props.onBlur }
      value             = { children }
      filterOption      = { (input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0 }
      size              = 'small'
    >
    {
      fixedValues.map( value => {
        return(
          <Option 
            value = { value }
            style = { { textAlign: align } }
            size  = 'small' >
            { value }
          </Option>
        );
      })
    }
    </Select>
  );
}




export class Cell extends React.Component {
  static propTypes = {   
    editMode:         PropTypes.bool.isOptional,
    isEditable:       PropTypes.bool.isOptional,
    fixedValues:      PropTypes.array.isOptional,
    align:            PropTypes.string.isOptional,
    data:             PropTypes.object.isOptional,
    width:            PropTypes.string.isOptional,
    dataIndex:        PropTypes.string.isRequired,
  }

  static defaultProps = {
    editMode: false,
    isEditable: false,
    fixedValues: [],
    align: 'left',
    width: '200px',
  }

  

  state = {
    originalData: null,
    fixedValues: [],
    originalWidth: null,
    width: '195px',
    editMode: false,
  }

  defaultRender = DefaultRender;

  type = 'input';

  componentWillReceiveProps = (newProps) => {
    if(this.state.originalWidth != newProps.width)
    {
      let clearWidth = newProps.width + '';
      clearWidth.replace('px', '');
      let floatWidth = parseFloat(clearWidth);
      floatWidth -= 5;

      this.setState({ 
        originalWidth: newProps.width, 
        width: floatWidth + 'px'});
    }


    if(this.state.originalData !== newProps.data && newProps.data.allowed_values)
    {
      let fixedValues = newProps.data.allowed_values[newProps.dataIndex] || [];
      if(fixedValues.length > 0)
      {
        this.setState({
          originalData: newProps.data,
          fixedValues
        });

        this.type = 'select';
      }
    }

    //изменение состояния
    /* if(newProps.editMode !== this.props.editMode)
    { */
      //console.log('edit mode changed! newProps, oldProps, type', newProps, this.props, type);

    let isBlocked = false;
    if(newProps.data.edit_locks)
    {
      isBlocked = newProps.data.edit_locks[newProps.dataIndex];
    }
    this.setState({ isBlocked });

    switch(this.type)  
    {
      case 'input': 
      {
        newProps.editMode && newProps.isEditable ? this.defaultRender = DefaultRenderEditable : this.defaultRender = DefaultRender;
        break;
      }
      case 'select':
      {
        newProps.editMode && newProps.isEditable ? this.defaultRender = SelectRenderEditable : this.defaultRender = SelectRender;
        break;
      }
    }
    /* } */
  }

  // отправляем изменненные данные
  onFieldChange = (newValue, column, record) => {
    
    let temp_record = this.props.data;
    temp_record[this.props.dataIndex] = newValue;

    store.dispatch(updatePositions([temp_record]));
  }

  // отправляем изменненные данные
  onLocalChange = (newValue, column, record) => {
    
    let temp_record = this.props.data;
    temp_record[this.props.dataIndex] = newValue;

    store.dispatch(localUpdateItem(temp_record));
  }

  onBlur = () => {
    let temp_record = this.props.data;
    store.dispatch(updatePositions([temp_record]));
  }

  render = () => {
    //console.log('cell props, state', this.props, this.state);
    return this.defaultRender({
      fixedValues:  this.state.fixedValues,
      children:     this.props.children,
      align:        this.props.align,
      width:        this.state.width,
      onFieldChange:this.onFieldChange,
      onBlur:       this.onBlur,
      onLocalChange:this.onLocalChange,
      isBlocked:    this.state.isBlocked,
    });
  }
  

}

export default Cell;