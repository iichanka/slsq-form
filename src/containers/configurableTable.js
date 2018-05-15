import React                            from 'react';
import PropTypes                        from 'prop-types'
import {  Table, Icon, Button, 
          Popover, Input, Row, Col,
          Checkbox, Select, Divider,
          Tooltip }                     from 'antd';
import { addPositionItem }              from '../actions/positions/addPosition';
import { localUpdateItem }              from '../actions/positions/main';

const Search = Input.Search;
const Option = Select.Option;

const initialState = {
  filtered: [],
  sorted: [],
  dropdownVisible: [],
  columns: [],
  data: [],
  filter: [],
};




const TableCell = ({ children, style, className, column, action, ...props}) => {
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

export default class ConfigurableTable extends React.Component {
  static PropTypes = {
    isProcessing:       PropTypes.bool.isRequired,
    config:             PropTypes.object.isRequired,
    data:               PropTypes.array.isRequired,
    isEditable:         PropTypes.bool.isRequired,
    dispatch:           PropTypes.func.isRequired,
  }

  constructor(props)
  {
    super(props);
    this.state = this.getStateFromProps(props);
    console.log('containers.configurableTable.constructor(props, state)', props, this.state);
  }

  componentWillReceiveProps(props)
  {
    this.setState(this.getStateFromProps(props));
    console.log('containers.configurableTable.componentWillReceiveProps(props, state)', props, this.state);
  }

  getStateFromProps = (props) => {
    const { config, data, isEditable } = props;
    let oldState = this.state;

    let state = { 
      columns: this.getColumns(config, data, isEditable),
      pagination: this.getPagination(config),
      scroll: this.getScroll(config),
      data
    };

    console.log('containers.configurableTable.getStateFromProps(props, state)', props, this.state);
    return state;
  }

  getScroll(config = { type: '' })
  {
    switch(config.type)
    {
      case 'RFR':
      case 'RFIT':
      case 'RFM':
      {
        return {
          y: 217, 
          x: '100%'
        }
      }
      default:
      {
        return {
          y: '100%', 
          x: '100%'
        };
      }
    }
  }

  getColumns(config, data, isEditable)
  {
    if(config && data)
    {
      if(config.columns && config.columns.length > 0)
      {
        let columns = config.columns.map( column => {
          if(column.visible && !column.technical)
          {
            column.className    = 'table-actions-without-padding';
            if(column.dataType === 'C' || column.dataType === 'Q')
            {
              column.className    = 'table-actions-without-padding numeric-field';
            }
            column.filterIcon   = ( column.searchable || column.sortable ) && 
              <Icon type  = "filter" 
                    style = {{ color: this.getColorForFilterIcon(column.dataIndex) }} />;
  
            column.filterDropdown         = this.buildDropdownForColumn(column, data);
            column.filterDropdownVisible  = this.getDropdownVisible(column.dataIndex);
            
            column.onFilterDropdownVisibleChange  = (visible) => { this.onFilterDropdownVisibleChange(visible, column.dataIndex) };

            column.render = (text, record) => { return this.simpleFieldRender(text, record, column) };
            
            if(column.dataType === 'C' || column.dataType === 'Q')
            {
              column.render = (text, record) => { return this.renderForCurrencyOrQuantity(text, record, column) };
            }

            if(column.editable && isEditable)
            {
              column.render = (text, record) => { return this.renderForEditableColumn(text, record, column) };
            }
            return column;
          }
          return null;
        }).filter( column => !!column );

        this.getColumnsExtended(config, data, isEditable, columns);

        console.log('containers.configurableTable.getColumns(config, data, isEditable, columns)', config, data, isEditable, columns);
        return columns;
      }
    }
    return [];
  }

  simpleFieldRender(text, record, column)
  {
    return (
      <TableCell column = { column } >
        { text }
      </TableCell> );
  }

  getActionsColmunForResults()
  {
    return {
      key:    'actions',
      title:  'Действия',
      width:  100,
      className: 'table-actions-without-padding',
      render: (text, record) => {
        return(
            <TableCell action = { true } >
                <Input  size = "small" 
                        placeholder = "1,000"
                        defaultValue = '1,000'
                        ref = { (ref) => { this.saveInputReference(record.key, ref) } }
                        style = {{ width: 100 }}
                        addonAfter = { <Icon type = "plus-circle-o" onClick = { (e) => { this.onAddClick(record) } } />}
                        onPressEnter = { (e) => { this.onAddClick(record) } } />
            </TableCell>
        ); 
      }
    };
  }

  getColumnsExtended(config, data, isEditable, columns = [])
  {
    if(columns.length === 0 || !isEditable)
    {
      return;
    }

    switch(config.type)
    {
      case 'RFR':
      case 'RFIT':
      case 'RFM':
      {
        columns.unshift(this.getActionsColmunForResults());
        break;
      }

      case 'POS':
      {
        columns.push(this.getActionsColmunForPositions());
      }
    }
  }

  getActionsColmunForPositions()
  {
    return {
      key:    'actions',
      title:  'Действия',
      width:  150,
      className: 'table-actions-without-padding',
      render: (text, record) => {
        return(
            <span>
              <a>Удалить</a>
              {
                record.isModified &&
                <span>
                  <Divider type="vertical" />
                  <a>Обновить</a>
                </span>
              }              
            </span>
        ); 
      }
    };
  }

  onAddClick(record)
  {
    const { dispatch, config } = this.props;
    let input = this.state.inputReference[record.key].input;

    if(input)
    {
      input.blur();
      switch(config.type)
      {
        case 'RFR':
        {
          dispatch(addPositionItem({ remnants: {...record, count: input.value } }));
        }
      }
    }
  }

  saveInputReference(key, ref)
  {
    let inputReference = this.state.inputReference || [];
    inputReference = inputReference.slice(0);

    if(!inputReference[key])
    {
      inputReference[key] = ref;
      this.setState({ inputReference });
    }
  }

  buildDropdownForColumn(column, data)
  {
    return null;
  }

  onFilterDropdownVisibleChange(visible, columnName)
  {
    let dropdownVisible = this.state.dropdownVisible || [];
    dropdownVisible[columnName] = visible;
    this.setState( { dropdownVisible });
  }

  renderForCurrencyOrQuantity(text, record, column)
  {
    return(
      <TableCell column = { column } >
        { this.formatValueToCurrency(record[column.dataIndex]) }
      </TableCell>
    );
  };

  formatValueToCurrency = (data = '') => {
    return Number(data.replace(',','')).toLocaleString('en', {style: 'currency', currency: 'USD'}).replace('$', '').replace('NaN', '0.00');
  }

  renderForEditableColumn(text, record, column)
  {
    let allowedValues = record.allowedValues.find( allowedValuesForFields => allowedValuesForFields.fieldName === column.dataIndex);
    if(allowedValues)
    {
      return(
        <TableCell column = { column }>
          <Select         
            showSearch
            style             = {{ width: column.width }}
            optionFilterProp  = "children"
            onChange          = { (newValue) => { this.onFieldChange(record, column, newValue); } }
            onBlur            = { this.onFieldBlur(record, column) }
            value             = { record[column.dataIndex] }
            filterOption      = { (input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0 }
            size              = 'small'
          >
          {
            allowedValues.values.map( valueRange => {
              return(
                <Option value = { valueRange.low } >
                  { valueRange.lowTitle }
                </Option>
              );
            })
          }
          </Select>
        </TableCell>);
    }
    if(column.dataType === 'CB')
    {
      return(
        <TableCell column = { column }>
          <Checkbox
            style         = {{ width: column.width, textAlign: 'center' }}
            value         = { record[column.dataIndex] }
            onChange      = { (event) => { this.onFieldChange(record, column, event.target.checked); } }
            size          = 'small' />
        </TableCell>
      );
    }
    return(
      <TableCell column = { column }>
        <Input 
          style         = {{ width: column.width, textAlign: (column.dataType === 'C' || column.dataType === 'Q') ? 'right' : 'left' }}
          value         = { (column.dataType === 'C' || column.dataType === 'Q') ? this.formatValueToCurrency(record[column.dataIndex]) : record[column.dataIndex] }
          onChange      = { (event) => { this.onFieldChange(record, column, event.target.value); } }
          onBlur        = { this.onFieldBlur(record, column) }
          onPressEnter  = { (event) => this.onFieldPressEnter(record, column, event) }
          size          = 'small' />
      </TableCell>
    );
  };

  onFieldBlur = (record, column) => {
    //console.log('containers.configurableTable.onFieldBlur()[record, column]', record, column);
  }

  onFieldPressEnter = (record, column, event) => {
    //console.log('containers.configurableTable.onFieldPressEnter()[record, column, event]', record, column, event);
  }


  onFieldChange = (record, column, newValue) => {
    const { dispatch } = this.props;
    const { data } = this.state;

    console.log('containers.configurableTable.onFieldChange()[record, column, newValue]', record, column, newValue);
    for(let i = 0; i < data.length; i++)
    {
      if(data[i].guid === record.guid)
      {
        let item = { ...data[i] };
        item.isModified = item[column.dataIndex] !== newValue;
        item[column.dataIndex] = newValue;
        dispatch(localUpdateItem(item));
        break;
      }
    }
  }

  getDropdownVisible(columnName)
  {
    let visible = false;
    try {
      visible = this.state.dropdownVisible[columnName];
    } catch (error) {
    }

    return visible;
  }

  getColorForFilterIcon(columnName)
  {
    let applyed = false;
    try {
      applyed = this.state.filter[columnName].applyed;
    } catch (error) {
    }
    
    return applyed ? '#108ee9' : '#aaa';
  }

  getPagination(config)
  {
    if(config)
    {
      if(config.pageSize)
      {
        return config.pageSize > 0 ? { pageSize: config.pageSize } : { pageSize: false };
      }
      else
      {
        return false;
      }
    }
  }

  onTableFilterChange = (pagination, filters, sorter) => {
    console.log('containers.configurableTable.onTableFilterChange(pagination, filters, sorter)', pagination, filters, sorter);
  }

  isModified(data = [])
  {
    for(let i = 0; i < data.length; i++)
    {
      if(data[i].isModified)
      {
        return true;
      }     
    }
    return false;
  }

  getFooterForTable(currentPageData)
  {  
    return(
      <Button type = "primary" icon = 'save' style = {{ float: 'right', top: -8 }} >Сохранить все изменения</Button>
    );
  }

  getRowClassName(record, index)
  {
    if(record.isModified)
    {
      return 'small-table-line highlighted-row';
    }
    return 'small-table-line'
  }

  render() {
    console.log('containers.configurableTable.render(state)', this.state);
    

    if(this.state.data && this.state.data.length > 0)
    {
      if( this.props.isEditable && this.props.config.type === 'POS' )
      {
        if(this.isModified(this.state.data))
        {
          return(
            <Table 
              columns      = { this.state.columns } 
              dataSource   = { this.state.data }
              size         = 'small'
              scroll       = { this.state.scroll } 
              loading      = { this.props.isProcessing }
              rowClassName = { this.getRowClassName.bind(this) } 
              onChange     = { this.onTableFilterChange.bind(this) }
              pagination   = { this.state.pagination }
              footer       = { this.getFooterForTable.bind(this) }
              />
          );
        }
        return(
          <Table 
            columns      = { this.state.columns } 
            dataSource   = { this.state.data }
            size         = 'small'
            scroll       = { this.state.scroll } 
            loading      = { this.props.isProcessing }
            rowClassName = { this.getRowClassName.bind(this) } 
            onChange     = { this.onTableFilterChange.bind(this) }
            pagination   = { this.state.pagination }
            />
        );
      }
      return(
        <Table 
          columns      = { this.state.columns } 
          dataSource   = { this.state.data }
          size         = 'small'
          scroll       = { this.state.scroll } 
          loading      = { this.props.isProcessing }
          rowClassName = { this.getRowClassName.bind(this) } 
          onChange     = { this.onTableFilterChange.bind(this) }
          pagination   = { this.state.pagination }
          />
      );
    }
    else
    {
      return(
          <div />
      );
    }
      
  };
}