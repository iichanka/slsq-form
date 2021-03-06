import React                            from 'react';
import PropTypes                        from 'prop-types'
import {  Table, Icon, Button, 
          Alert, Input, Row, Col,
          Checkbox, Select, Divider,
          Tooltip }   from 'antd';
import { addPositionItem }              from '../actions/positions/addPosition';
import { FixedHeader }          from '../components/';

const components = {
  header: {
    cell: FixedHeader,
  },
};

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
    this.state = {
      columns: this.getColumns_(props),
      data: props.data
    };

      /* this.state = this.getStateFromProps(props);
    console.log('containers.configurableTable.constructor(props, state)', props, this.state); */
  }

  getColumns_ = ({config, isEditable}) => {
    let columns = [];
    if(config && config.columns && config.columns.length)
    {
      columns = config.columns.map(column => {
        if(column.visible)
        {
          //quantity, integers and floats - right align
          let columnAlign = 
            column.data_type === 'Q' || 
            column.data_type === 'F' ||
            column.data_type === 'I' ? 'right' : 'left';
  
          column.render = (text, record) => {
            let placement = columnAlign === 'left' ? 'topLeft' : 'topRight';
            return(
              <Tooltip 
                title     = { text }
                placement = { placement } >
                <div 
                  className = 'field-no-wrap'
                  style     = {{ textAlign: columnAlign, maxWidth: column.width}}>
                  { text }
                </div>
              </Tooltip>
            );
          }  
          return column;
        }
        return null;
      }).filter(column => !!column);

      if(isEditable)
      {
        columns.unshift({
          key: 'action',
          width: 100,
          render: (text, record) => {
            return(
                <div>
                    <Input  
                      size            = "small" 
                      placeholder     = "1,000"
                      defaultValue    = '1,000'
                      ref             = { (ref) => { this.saveInputReference(record.key, ref) } }
                      addonAfter      = { <Icon type = "plus-circle-o" onClick = { (e) => { this.onAddClick(record) } } />}
                      onPressEnter    = { (e) => { this.onAddClick(record) } } />
                </div>
            ); 
          }
        });
      }
    }
    return columns;
  }

  componentWillReceiveProps(newProps)
  {
    //перестройка колонок
    if(this.state.config !== newProps.config)
    {
      this.setState({columns: this.getColumns_(newProps)});
    }

    if(this.state.data !== newProps.data)
    {
      this.setState({ data: newProps.data });
    }


    /* this.setState(this.getStateFromProps(newProps));
    console.log('containers.configurableTable.componentWillReceiveProps(props, state)', newProps, this.state); */
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

  getActionsColmunForResults()
  {
    return {
      key:    'actions',
      title:  'Действия',
      width:  100,
      fixed: 'left',
      className: 'table-actions-without-padding',
      render: (text, record) => {
        return(
            <div>
                <Input  size = "small" 
                        placeholder = "1,000"
                        defaultValue = '1,000'
                        ref = { (ref) => { this.saveInputReference(record.key, ref) } }
                        style = {{ width: 100 }}
                        addonAfter = { <Icon type = "plus-circle-o" onClick = { (e) => { this.onAddClick(record) } } />}
                        onPressEnter = { (e) => { this.onAddClick(record) } } />
            </div>
        ); 
      }
    };
  }


  onAddClick(record)
  {
    const { dispatch, config } = this.props;
    let input = this.state.inputReference[record.key].input;

    console.log('onAddClick', record, this.props);

    if(input)
    {
      input.blur();
      switch(config.type)
      {
        case 'REMNANTS':
        {
          dispatch(addPositionItem({ remnants: {...record, count: input.value } }));
          break;
        }
        case 'IN_TRANSIT':
        {
          dispatch(addPositionItem({ in_transit: {...record, count: input.value } }));
          break;
        }
        case 'MATERIALS':
        {
          dispatch(addPositionItem({ materials: {...record, count: input.value } }));
          break;
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
      <span style = {{ textAlign: 'right' }}>
        { this.formatValueToCurrency(record[column.dataIndex]) }
      </span>
    );
  };

  formatValueToCurrency = (data) => {
    return Number(data.replace(',','')).toLocaleString('en', {style: 'currency', currency: 'USD'}).replace('$', '').replace('NaN', '0.00');
  }

  renderForEditableColumn(text, record, column)
  {
    let allowedValues = record.allowedValues.find( allowedValuesForFields => allowedValuesForFields.fieldName === column.dataIndex);
    if(allowedValues)
    {
      return(
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
        </Select>);
    }
    if(column.dataType === 'CB')
    {
      return(
        <Checkbox
          style         = {{ width: column.width, textAlign: 'center' }}
          value         = { record[column.dataIndex] }
          onChange      = { (event) => { this.onFieldChange(record, column, event.target.checked); } }
          size          = 'small'
        />
      );
    }
    return(
      <Input 
        style         = {{ width: column.width, textAlign: (column.dataType === 'C' || column.dataType === 'Q') ? 'right' : 'left' }}
        value         = { (column.dataType === 'C' || column.dataType === 'Q') ? this.formatValueToCurrency(record[column.dataIndex]) : record[column.dataIndex] }
        onChange      = { (event) => { this.onFieldChange(record, column, event.target.value); } }
        onBlur        = { this.onFieldBlur(record, column) }
        onPressEnter  = { (event) => this.onFieldPressEnter(record, column, event) }
        size          = 'small'
      />
    );
  };

  onFieldBlur = (record, column) => {
    console.log('containers.configurableTable.onFieldBlur()[record, column]', record, column);
  }

  onFieldPressEnter = (record, column, event) => {
    console.log('containers.configurableTable.onFieldPressEnter()[record, column, event]', record, column, event);
  }


  onFieldChange = (record, column, newValue) => {
    console.log('containers.configurableTable.onFieldChange()[record, column, newValue]', record, column, newValue);
    let data = this.state.data.slice(0);
    for(let i = 0; i < data.length; i++)
    {
      if(data[i].guid === record.guid)
      {
        data[i].isModified = data[i][column.dataIndex] !== newValue;
        data[i][column.dataIndex] = newValue;
        break;
      }
    }

    this.setState({ data });
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
        return config.pageSize > 0 ? { pageSize: config.pageSize } : false;
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

  getFooterForTable(currentPageData)
  {
    console.log('containers.configurableTable.getFooterForTable(currentPageData, state)', currentPageData, this.state);
    let updateAllButton = false;
    let data = this.state.data || [];
    data = data.slice(0);

    for(let i = 0; i < data.length; i++)
    {
      if(data[i].isModified)
      {
        updateAllButton = true;
        break;
      }     
    }
    
    return(
      updateAllButton ? 
        <Button type = "primary" icon = 'save' style = {{ float: 'right', top: -8 }} >Сохранить все изменения</Button> :
        <Button type = "primary" icon = 'save' style = {{ float: 'right', top: -8 }} disabled>Сохранить все изменения</Button>
    );
  }

  getRowClassName = (record, index) =>
  {
    return 'small-table-line';
  }


  render() {
    console.log('containers.configurableTable.render(state)', this.state);

    let tableWidth = 0;
    if(this.state.columns.length){
      //Считаем ширину таблицы
      this.state.columns.forEach(function(item, i, arr) {
        tableWidth+=parseInt(item.width);
      });
    }
    
    if(this.state.data && this.state.data.length)
    {
      return(
        <Table 
          className    = 'very-small-table'
          columns      = { this.state.columns } 
          dataSource   = { this.state.data }
          size         = 'small'
          components   = { components }
          /* scroll       = { this.state.scroll }  */
          scroll       = {{ x: tableWidth, y: '100%' }}
          loading      = { this.props.isProcessing }
          rowClassName = { this.getRowClassName } 
          /* onChange     = { this.onTableFilterChange.bind(this) } */
          /* pagination   = { this.state.pagination } */
          />
      );
    }
      
    return (
      <Alert
        message = 'Ничего не найдено'
        type    = 'info'
        style   = {{ margin: 8 }}
      />
    );
  };
}