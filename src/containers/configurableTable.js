import React                            from 'react';
import PropTypes                        from 'prop-types'
import {  Table, Icon, Button, 
          Popover, Input, Row, Col,
          Checkbox, Select, Divider,
          Tooltip }                     from 'antd';
import { localUpdateItem }              from '../actions/positions/main';
import { TableCell }                    from '../components';
import { PersonalizationModifier }      from '../components';
import { ResizableColumn }              from '../components';
import { isEqual }                      from '../utils';

/* import { Resizable } from 'react-resizable';
import 'react-resizable/css/styles.css';

const ResizeableTitle = props => {
  const { onResize, width, ...restProps } = props;

  if (!width) {
    return <th {...restProps} />;
  }

  return (
    <Resizable width={width} height={0} onResize={onResize}>
      <th {...restProps} />
    </Resizable>
  );
}; */

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
    isProcessing:             PropTypes.bool.isRequired,
    config:                   PropTypes.object.isRequired,
    data:                     PropTypes.array.isRequired,
    isEditable:               PropTypes.bool.isRequired,
    isPersonalizationActive:  PropTypes.bool.isRequired,
    dispatch:                 PropTypes.func.isRequired,
    modifyColumns:            PropTypes.func,
    onPositionDelete:         PropTypes.func,
    onPositionUpdate:         PropTypes.func,
    onPositionsUpdateAll:     PropTypes.func,
    onAddClick:               PropTypes.func,
    scrollWidth:              PropTypes.any,
    scrollHeight:             PropTypes.any,
  }

  filters = [];
  sorters = [];

  constructor(props)
  {
    super(props);
    this.state = this.getStateFromProps(props);

    const that = this;
    this.dragConfig = {
      onDragEnd(fromIndex, toIndex) {
        console.log('onDragEnd');
        const columns = that.state.columns;
        const item = columns.splice(fromIndex, 1)[0];
        columns.splice(toIndex, 0, item);
        that.setState({
            columns
        });
      },
      nodeSelector: "th"
    };
  }

  componentWillReceiveProps(props)
  {
    this.setState(this.getStateFromProps(props));
  }

  getStateFromProps = (newProps) => {
    const { config, data, isEditable, isPersonalizationActive } = newProps;
    let oldConfig                   = {}, 
        oldData                     = [], 
        oldColumns                  = [], 
        oldComponents               = {},
        oldIsPersonalizationActive  = false;
    
    if(this.state)
    {
      oldConfig                   = this.state.config;
      oldData                     = this.state.data;
      oldIsPersonalizationActive  = this.state.isPersonalizationActive;
      oldColumns                  = this.state.columns;
      oldComponents               = this.state.components;
    }
    

    return {
      pagination: this.getPagination(config),
      scroll: this.getScroll(newProps),
      isPersonalizationActive,
      components: {
        header: {
          cell: ResizableColumn,
        },
      },
    };
  }

  filterData = () =>
  {
    const { data } = this.props;
    
    if(data)
    {
      let filteredData = data.map(record => record);
      
      for(let field in this.filters)
      {
        if(this.filters[field].active === true)
        {
          filteredData = filteredData.map(record => {
            if(this.filters[field].selectedValues.indexOf(record[field]) === -1)
            {
              return null;
            }
            return record;
          }).filter(record => !!record);
        }       

        if(this.sorters[field] === 'asc')
        {
          filteredData.sort((a, b) => {
            if(a[field] < b[field]) return -1;
            if(a[field] > b[field]) return 1;
            return 0;
          });
        }

        if(this.sorters[field] === 'desc')
        {
          filteredData.sort((a, b) => {
            if(a[field] > b[field]) return -1;
            if(a[field] < b[field]) return 1;
            return 0;
          });
        }
      }

      return filteredData;
    }
    return null;
  }


  updateFilters = (data) =>
  {
    let columns = [];
    if(this.props.config)
    {
      columns = this.props.config.columns;
    }

    if(data && columns)
    {
      columns.map(column => {
        if(!this.filters[column.dataIndex])
        {
          this.filters[column.dataIndex] = { };
        }

        if(!this.filters[column.dataIndex].active)
        {
          if(!this.filters[column.dataIndex].selectedValues)
          {
            this.filters[column.dataIndex].selectedValues = [];
          }

          this.filters[column.dataIndex].allValues = [];

          data.map(record => {
            if(this.filters[column.dataIndex].allValues.indexOf(record[column.dataIndex]) === -1)
            {
              this.filters[column.dataIndex].allValues.push(record[column.dataIndex]);
            }
          })

          this.filters[column.dataIndex].allValues.sort((a, b) => a > b );    
        }
      })
    }
  }


  getScroll({ scrollWidth, scrollHeight})
  {
    return {
      x: scrollWidth  ? scrollWidth  : '100%',
      y: scrollHeight ? scrollHeight : '100%',
    };
  }

  getColumns()
  {
    const {config, data, isEditable} = this.props;

    if(config && data)
    {
      if(config.columns && config.columns.length > 0)
      {
        let columns = config.columns.map( (column, index) => {
          if(column.visible && !column.technical)
          {
            column.className    = 'table-line-without-padding';
            if(column.dataType === 'C' || column.dataType === 'Q')
            {
              column.className    = 'table-line-without-padding numeric-field';
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

            column.onHeaderCell = (cell) => {
              console.log('onHeaderCell', cell);
              return {
                width: cell.width,
                onResize: this.onColumnResize(index).bind(this),
              }
            };

            return column;
          }
          return null;
        }).filter( column => !!column );

        if(this.props.modifyColumns)
        {
          this.props.modifyColumns(config, data, isEditable, columns);
        }

        console.log('containers.configurableTable.getColumns(config, data, isEditable, columns)', config, data, isEditable, columns);
        return columns;
      }
    }
    return [];
  }

  simpleFieldRender(text, record, column)
  {
    if(!record.allowedValues)
    {
      record.allowedValues = [];
    }
    let allowedValues     = record.allowedValues.find( allowedValuesForFields => allowedValuesForFields.fieldName === column.dataIndex);
    let replacmentValue   = text;  
    if(allowedValues)
    {
      allowedValues.values.find( valueRange => {
        if(valueRange.low === text)
        {
          replacmentValue = valueRange.lowTitle;
          return true;
        }
        return false;
      });
    }
    return (
      <TableCell column = { column } >
        { replacmentValue }
      </TableCell> );
  } 

  onSorterToogle = (column, type) => {
    if(this.sorters[column.dataIndex] === type)
    {
      this.sorters[column.dataIndex] = '';
    }
    else
    {
      this.sorters[column.dataIndex] = type;
    }

    this.forceUpdate();
  }

  getSortButton = (column, type) => {
    let label = '';
    let icon  = ''
    switch(type)
    {
      case 'asc'  : { label = 'Сортировать от А до Я'; icon = 'arrow-down'; break; }
      case 'desc' : { label = 'Сортировать от Я до А'; icon = 'arrow-up';   break; }
    }

    if(this.sorters[column.dataIndex] === type)
    {
      return(
        <Button style = {{ width: '100%', marginTop: 5 }}
                size = 'small'
                icon = { icon }
                type = 'primary'
                onClick = { event => { this.onSorterToogle(column, type) } }>
          { label }
        </Button>
      )
    }
    return(
      <Button style = {{ width: '100%', marginTop: 5 }}
              size = 'small'
              icon = { icon }
              onClick = { event => { this.onSorterToogle(column, type) } }>
        { label }
      </Button>);
  }

  buildDropdownForColumn(column, data)
  {
    if(column.searchable)
    return(
      <div className="custom-filter-dropdown">
        <Row>
          <Col span = { 24 }>
            { this.getSortButton(column, 'asc') }
          </Col>
        </Row>
        <Row>
          <Col span = { 24 } >
          { this.getSortButton(column, 'desc') }
          </Col>
        </Row>
{/*         <Row>
          <Col span = { 24 } >
            <Search
              style       = {{ marginTop: 5 }}
              placeholder = "Поиск..."
              //onSearch    = { value => { aviableValues.push(value); this.filters.push({ field: column.dataIndex, values: aviableValues}) } }
              size        = 'small'
              enterButton
            />
          </Col>
        </Row> */}
        <Row>
          <Col span = { 24 } className = 'scrollable-y' style = {{ maxHeight: 250 }}>
            { 
              this.filters[column.dataIndex].allValues.map( (value) => 
              <Row>
                <Col span = { 24 } >
                  <Checkbox checked = { this.filters[column.dataIndex].selectedValues.indexOf(value) !== -1 } 
                            onChange = { event => { this.onFilterSelect(column.dataIndex, value, event.target.checked) } }>
                    { value }
                  </Checkbox>
                </Col>
              </Row>
              )
            }
          </Col>
        </Row>
      </div>
    );
  }

  onFilterSelect = (field, value, checked) =>
  {
    if(checked)
    {
      this.filters[field].selectedValues.push(value);
      this.filters[field].active = true;
    }
    else
    {
      this.filters[field].selectedValues.splice(this.filters[field].selectedValues.indexOf(value), 1);
      this.filters[field].active = this.filters[field].selectedValues.length !== 0;
    }
    this.forceUpdate();
  }

  onFilterDropdownVisibleChange(visible, columnName)
  {
    let dropdownVisible = this.state.dropdownVisible || [];
    dropdownVisible[columnName] = visible;
    this.setState( { dropdownVisible });
  }

  onColumnResize = index => (e, { size }) => {
    console.log('onColumnResize', e, size);
    this.setState(({ columns }) => {
      const nextColumns = [...columns];
      nextColumns[index] = {
        ...nextColumns[index],
        width: size.width,
      };
      return { columns: nextColumns };
    });
  };

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
    const { dispatch, data } = this.props;
    

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
      applyed = this.filters[columnName].active || this.sorters[columnName] === 'asc' || this.sorters[columnName] === 'desc';
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
    if(this.props.onPositionsUpdateAll)
    {
      return(
        <Button 
          type = "primary" 
          icon = 'save' 
          onClick = { event => { this.props.onPositionsUpdateAll(this.props.data.map(item => item.isModified ? item : null).filter(item => !!item)) } }
          style = {{ float: 'right', top: -8 }} >Сохранить все изменения</Button>
      );
    }
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
    

    let data = this.filterData();
    this.updateFilters(data);
    let columns = this.getColumns();

    console.log('containers.configurableTable.render(state)', this.state);
    console.log('containers.configurableTable.render(data, filteredData)', this.props.data, data);
    console.log('containers.configurableTable.render(sorters, filters)', this.sorters, this.filters);

    if(data.length > 0)
    {
      if( this.props.isEditable && this.props.config.type === 'POS' )
      {
        if(this.isModified(data))
        {
          return(
            <PersonalizationModifier 
              isPersonalizationActive = { this.props.isPersonalizationActive }
              components              = { this.state.components }
              {...this.dragConfig} >
              <Table 
                columns      = { columns }
                dataSource   = { data }
                size         = 'small'
                scroll       = { this.state.scroll } 
                loading      = { this.props.isProcessing }
                rowClassName = { this.getRowClassName.bind(this) } 
                onChange     = { this.onTableFilterChange.bind(this) }
                pagination   = { this.state.pagination }
                footer       = { this.getFooterForTable.bind(this) }
                />
            </PersonalizationModifier>
          );
        }
        return(
          <PersonalizationModifier 
            isPersonalizationActive = { this.props.isPersonalizationActive }
            components              = { this.state.components }
            {...this.dragConfig} >
            <Table 
              columns      = { columns }
              dataSource   = { data }
              size         = 'small'
              scroll       = { this.state.scroll } 
              loading      = { this.props.isProcessing }
              rowClassName = { this.getRowClassName.bind(this) } 
              onChange     = { this.onTableFilterChange.bind(this) }
              pagination   = { this.state.pagination }
              />
          </PersonalizationModifier>
        );
      }
      return(
        <PersonalizationModifier 
          isPersonalizationActive = { this.props.isPersonalizationActive }
          components              = { this.state.components }
          {...this.dragConfig} >
          <Table 
            columns      = { columns }
            dataSource   = { data }
            size         = 'small'
            scroll       = { this.state.scroll } 
            loading      = { this.props.isProcessing }
            rowClassName = { this.getRowClassName.bind(this) } 
            onChange     = { this.onTableFilterChange.bind(this) }
            pagination   = { this.state.pagination }
            />
        </PersonalizationModifier>
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