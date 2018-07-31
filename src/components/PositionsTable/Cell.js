import React                            from 'react';
import PropTypes                        from 'prop-types';
import { Tooltip, Select }               from 'antd';

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

const SelectRenderEditable = (props) => {
  const { fixedValues, children, align, width } = props;

  let title = children;
  let fixedValue = fixedValues.find(fixedVal => fixedVal.value === children);
  if(fixedValue)
  {
    title = fixedValue.title;
  }

  return(
    <Select         
      showSearch
      style             = {{ width }}
      optionFilterProp  = "children"
      /* onChange          = { (newValue) => { this.onFieldChange(record, column, newValue); } } */
      /* onBlur            = { this.onFieldBlur(record, column) } */
      value             = { title }
      filterOption      = { (input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0 }
      size              = 'small'
    >
    {
      fixedValues.map( valueRange => {
        return(
          <Option value = { valueRange.value } >
            { valueRange.title }
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
  }

  type = 'default';

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

    if(this.state.originalData !== newProps.data)
    {
      let fixedValues = this.buildFixedValues(newProps.data.allowed_values);
      if(fixedValues.length > 0)
      {
        this.setState({
          originalData: newProps.data,
          fixedValues, 
        });
        this.type = 'select';
      }
    }
  }

  buildFixedValues = (allowedValues = []) => {
    let allowedVals = allowedValues.find(allowedVal => allowedVal.field_name == this.props.dataIndex);
    if(allowedVals)
    {
      return allowedVals.values.map(valStruc => {
        return {
          value: valStruc.low,
          title: valStruc.low_title,
        }
      })
    }
    return [];
  }

  render = () => {
    switch(this.type)
    {
      case 'select':
      {
        console.log('cell props', this.props);
        if(this.props.editMode && this.props.isEditable)
        {
          return(
            <SelectRenderEditable
              fixedValues = { this.state.fixedValues }
              children    = { this.props.children }
              align       = { this.props.align } 
              width       = { this.state.width } />);

        }
        return(
          <SelectRender
            fixedValues = { this.state.fixedValues }
            children    = { this.props.children }
            align       = { this.props.align } 
            width       = { this.state.width } />);
      }

      case 'default':
      {
        if(this.props.editMode && this.props.isEditable)
        {
          return(
            <DefaultRenderEditable
              fixedValues = { this.state.fixedValues }
              children    = { this.props.children }
              align       = { this.props.align } 
              width       = { this.state.width } />);

        }
        return(
          <DefaultRender
            fixedValues = { this.state.fixedValues }
            children    = { this.props.children }
            align       = { this.props.align } 
            width       = { this.state.width } />);
      }
    }
    return(<div/>);
  }
  

}

export default Cell;