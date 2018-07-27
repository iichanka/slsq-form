import React                            from 'react';
import PropTypes                        from 'prop-types'
import {  Table, Icon, Button, 
          Popover, Input, Row, Col,
          Checkbox, Select }            from 'antd';
import { addPositionItem }              from '../actions/positions/addPosition';

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
    isSearching:        PropTypes.bool.isRequired,
    config:             PropTypes.object.isRequired,
    data:               PropTypes.array.isRequired,
    isEditable:         PropTypes.bool.isRequired,
    dispatch:           PropTypes.func.isRequired,
  }

  inputRefs = [];
  inputValues = [];
  filters = [];
  /*
  {
    field: string,
    values: [
      val1,
      val2,
      ...
    ]
  }
  */

  isActiveFilter(values = [])
  {
    for(let i = 0; i < values.length; i++)
    {
      if(values[i].active)
      {
        return true;
      }
    }

    return false;
  }

  getFilter(fieldName = '', data = [])
  {
    let filterValues = [];

    data.map( record => {
      if(filterValues.indexOf(record[fieldName]) === -1)
      {
        filterValues.push(record[fieldName]);
      }
    });

    filterValues.sort();
    return {
      field: fieldName,
      values: filterValues.map( val => {
        if(val === '')
        {
          val = '(пусто)';
        }
        return {
          active: false,
          value: val,
        }
      }),
    }
  }



  buildConfigForResults = (config) => {
    console.log('containers.search.results.ConfigurableTable.buildConfig()[config]', config);

    const msg = {
        content: (
            <div>
                <p>Форма заявки находится в режиме просмотра.</p>
                <p>Чтобы перейти в режим редактирования нажмите кнопку "Обработать".</p>
            </div>),
        title: 'Добавление позиций недоступно',
    }  

    this.columns.unshift({
        key:    'actions',
        title:  'Действия',
        width:  '100px',
        className: 'table-actions-without-padding',
        render: (text, record) => {
            if(this.props.isEditable)
            {
                return(
                    <div>
                        <Input  size = "small" 
                                placeholder = "1,000"
                                defaultValue = '1,000'
                                ref = { (ref) => { this.inputRefs[record.key] = ref; } }
                                style = {{ width: 100 }}
                                addonAfter = { <Icon type = "plus-circle-o" onClick = { (e) => { this.onAddClick(record) } } />}
                                onPressEnter = { (e) => { this.onAddClick(record) } } />
                    </div>
                );
            }
            return(
                <Popover content = { msg.content }
                            title   = { msg.title } >
                    <Icon type    = "frown-o"
                          onClick = { event => { this.onAddClick(record) } } />
                </Popover>
            );
        }
    });
       
  }

  applyFiltersToData()
  {
    let clearFilters = [];
    
    this.filters.map( filter => {
      let clearValues = [];
      clearValues = filter.values.map( filterValue => {
        if(filterValue.active)
        {
          return filterValue;
        }
        return null;
      }).filter( filterValue => !!filterValue);

      if(clearValues.length > 0)
      {
        clearFilters.push({
          field: filter.field,
          values: clearValues,
        })
      }
    });

    console.log('containers.configurableTable.applyFiltersToData()[filters, clearFilters]', this.filters, clearFilters);
    let isOK = true;
    return this.state.data.map( record => {
      isOK = true;
      clearFilters.map(filter => {
        if(!this.findWithAttr(filter.values, 'value', record[filter.field]))
        {
          isOK = false;
        }
      });

      return isOK ? record : null;
    }).filter( record => !!record );
  }

  buildDropdown(column, data = [])
  {
    let avaibleValues = [];
    let filter = this.filters.find( filter => filter.field === column.dataIndex);
    if(!filter)
    {
      this.filters.push(this.getFilter(column.dataIndex, data));
      filter = this.filters.find( filter => filter.field === column.dataIndex);
    }
    else
    {
      if(!this.isActiveFilter(filter.values))
      {
        filter = this.getFilter(column.dataIndex, data);
      }
    }

    console.log('containers.search.results.ConfigurableTable.buildDropdown()[filter]', filter);

    return(
      <div className="custom-filter-dropdown">
        <Row>
          <Col span = { 24 }>
            <Button style = {{ width: '100%', marginTop: 5 }}
                    size = 'small'
                    icon = 'arrow-down'>
              Сортировать от А до Я
            </Button>
          </Col>
        </Row>
        <Row>
          <Col span = { 24 } >
            <Button style = {{ width: '100%', marginTop: 5 }}
                    size = 'small'
                    icon = 'arrow-up'>
              Сортировать от Я до А
            </Button>
          </Col>
        </Row>
        <Row>
          <Col span = { 24 } >
            <Search
              style       = {{ marginTop: 5 }}
              placeholder = "Поиск..."
              //onSearch    = { value => { aviableValues.push(value); this.filters.push({ field: column.dataIndex, values: aviableValues}) } }
              size        = 'small'
              enterButton
            />
          </Col>
        </Row>
        <Row>
          <Col span = { 24 } className = 'scrollable-y' style = {{ maxHeight: 250 }}>
            { 
              filter.values.map( (value) => 
              <Row>
                <Col span = { 24 } >
                  <Checkbox checked = { value.active } 
                            onChange = { event => { this.toggleFilterValue(filter, value.value, event.target.checked) } } >{ value.value }</Checkbox>
                </Col>
              </Row>
              )
            }
          </Col>
        </Row>
      </div>
    );
  }

  toggleFilterValue = (filter, value, active) => {
    for(let i = 0; i < filter.values.length; i++)
    {
      if(filter.values[i].value === value)
      {
        filter.values[i].active = active;
        break;
      }
    }
  }

  findWithAttr = (array, attr, value) => {
    console.log('containers.search.results.ConfigurableTable.findWithAttr()[array, attr, value]', array, attr, value);
    for(var i = 0; i < array.length; i += 1) {
      if(array[i][attr] === value) {
          return i;
      }
    }
    return undefined;
  }


  //построение конфига колонок
  buildConfig = (config = {columns:[], type: '', pageSize: 0}, data = []) => {
    console.log('containers.search.results.ConfigurableTable.buildConfig()[config]', config);
    switch(config.type)
    {
        case 'REMNANTS':
        case 'IN_TRANSIT':
        case 'MATERIALS':
        {
            this.scroll = {
                y: 217, 
                x: '100%'
            }
            break;
        }
        default:
        {
            this.scroll = {
                y: '100%', 
                x: '100%'
            }
        }
    }

    this.columns = [];

    config.columns.map(column => {
        if(column.visible)
        {
            column.className    = 'table-actions-without-padding';
            column.filterIcon   = ( column.searchable || column.sortable ) && 
              <Icon type  = "filter" 
                    style = {{ color: (this.state.filtered[column.key] || this.state.sorted[column.key]) ? '#108ee9' : '#aaa' }} />;

            column.filterDropdown         = this.buildDropdown(column, data);
            column.filterDropdownVisible  = this.state.dropdownVisible[column.key];
           
            column.onFilterDropdownVisibleChange  = (visible) => {
              let dropdownVisibleNew = this.state.dropdownVisible || [];
              dropdownVisibleNew[column.key] = visible;
              this.setState({...this.state, dropdownVisible: dropdownVisibleNew})
            };

            this.columns.push(column);            
        }
    })

    if(this.columns.length > 0)
    {
        switch(config.type)
        {
            case 'REMNANTS':
            case 'IN_TRANSIT':
            case 'MATERIALS':
            {
                this.buildConfigForResults(config);
                break;
            }
            default:
        }
        
    }
    console.log('containers.search.results.ConfigurableTable.buildConfig()[this.columns]', this.columns);
  }

  onAddClick = (record) => {
    const { dispatch, config } = this.props;
    let input = this.inputRefs[record.key].input;

    if(input)
    {
        input.blur();
        switch(config.type)
        {
            case 'REMNANTS':
            {
                dispatch(addPositionItem({ remnants: {...record, count: input.value } }));
            }
        }

        
    }
  }

  handleTableChange(pagination, filters, sorter) {
    console.log('containers.search.results.ConfigurableTable.handleTableChange()', pagination, filters, sorter);
  }

  getStateFromProps2 = (props) => {
    const { config, data } = props;
    let pagination = false;

    if(config)
    {
      if(config.pageSize !== 0)
      {
        pagination = { pageSize: config.pageSize };
      }
    }

    let oldState = this.state || initialState;
    let newState = {
      columns: this.buildColumns(oldState, props),
      pagination,
      data
    };

    newState = { ...oldState, newState };
    console.log('containers.configurableTable.getStateFromProps2()[newState]', newState);

    return newState;
  }

  getColorForFilter = (key) => {
    let filter = this.state.filter[key];
    if(filter)
    {
      return filter.applyed ? '#108ee9' : '#aaa';
    }
    return '#aaa';
  }

  buildColumns = (newProps) => {
    const { config, data } = newProps;
    let newColumns = [];
    if(config)
    {
      
      newColumns = config.columns.map( field => {
        if(field.visible && !field.technical)
        {
          field.className    = 'table-actions-without-padding';
          field.filterIcon   = ( field.searchable || field.sortable ) && 
            <Icon type  = "filter" 
                  style = {{ color: this.getColorForFilter(field.key) }} />;

          field.filterDropdown         = this.buildDropdownForColumn(field, data);
          field.filterDropdownVisible  = this.state.dropdownVisible[field.key];
          
          field.onFilterDropdownVisibleChange  = (visible) => { this.onFilterDropdownVisibleChange(visible, field.key) };
          if(field.editable)
          {
            field.render = (text, record) => { this.renderForEditableColumn(text, record, field) };
          }
        }
      })
    }
    return newColumns;
  }

  buildDropdownForColumn = (field, data) => {
    /* let avaibleValues = [];
    let filter = oldState.filter[field.key];

    if(!filter)
    {
      this.filters.push(this.getFilter(column.dataIndex, data));
      filter = this.filters.find( filter => filter.field === column.dataIndex);
    }
    else
    {
      if(!this.isActiveFilter(filter.values))
      {
        filter = this.getFilter(column.dataIndex, data);
      }
    }

    console.log('containers.search.results.ConfigurableTable.buildDropdown()[filter]', filter);

    return(
      <div className="custom-filter-dropdown">
        <Row>
          <Col span = { 24 }>
            <Button style = {{ width: '100%', marginTop: 5 }}
                    size = 'small'
                    icon = 'arrow-down'>
              Сортировать от А до Я
            </Button>
          </Col>
        </Row>
        <Row>
          <Col span = { 24 } >
            <Button style = {{ width: '100%', marginTop: 5 }}
                    size = 'small'
                    icon = 'arrow-up'>
              Сортировать от Я до А
            </Button>
          </Col>
        </Row>
        <Row>
          <Col span = { 24 } >
            <Search
              style       = {{ marginTop: 5 }}
              placeholder = "Поиск..."
              //onSearch    = { value => { aviableValues.push(value); this.filters.push({ field: column.dataIndex, values: aviableValues}) } }
              size        = 'small'
              enterButton
            />
          </Col>
        </Row>
        <Row>
          <Col span = { 24 } className = 'scrollable-y' style = {{ maxHeight: 250 }}>
            { 
              filter.values.map( (value) => 
              <Row>
                <Col span = { 24 } >
                  <Checkbox checked = { value.active } 
                            onChange = { event => { this.toggleFilterValue(filter, value.value, event.target.checked) } } >{ value.value }</Checkbox>
                </Col>
              </Row>
              )
            }
          </Col>
        </Row>
      </div>
    ); */
  };

  onFilterDropdownVisibleChange = (visible, key) => {
    let dropdownVisible = this.state.dropdownVisible;
    dropdownVisible[key] = visible;
    this.setState({ dropdownVisible })
  }

  renderForEditableColumn = (text, record, field) => {
    let allowedValues = record.allowedValues.find( allowedValuesForFields => allowedValuesForFields.fieldName === field.dataIndex);
    if(allowedValues)
    {
      return(
        <Select         
          showSearch
          style             = {{ width: field.width }}
          optionFilterProp  = "children"
          onChange          = { (value) => { this.onFieldChange(record, field, value); } }
          onBlur            = { this.onBlurForField(record, field) }
          value             = { record[field.dataIndex] }
          filterOption      = { (input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0 }
        >
        {
          allowedValues.values.map( valueRange => {
            <Option value = { valueRange.low } >
              { valueRange.low }
            </Option>
          })
        }
        </Select>);
    }
    return(
      <Input 
        style         = {{ width: field.width }}
        value         = { record[field.dataIndex] }
        onChange      = { (value) => { this.onFieldChange(record, field, value); } }
        onBlur        = { this.onBlurForField(record, field) }
        onPressEnter  = { this.onBlurForField(record, field) }
      />
    );
  };

  onBlurForField = (record, field) => {
    console.log('containers.configurableTable.onBlurForField()[record, field]', record, field);
  }

  onFieldChange = (record, field, newValue) => {
    console.log('containers.configurableTable.onFieldChange()[record, field, newValue]', record, field, newValue);
  }


  constructor(props)
  {
      super(props);
      this.state = this.getStateFromProps2(props);
  }

  componentWillReceiveProps(newProps)
  {
    this.setState(this.getStateFromProps2(newProps));
  }

  getStateFromProps = (props) => {
    const { config, data } = props;
    console.log('containers.ConfigurableTable.getStateFromProps()[props]', props);   

    let pagination = false;

    if(config)
    {
      if(config.pageSize !== 0)
      {
        pagination = { pageSize: config.pageSize };
      }
    }

    return { pagination, data: data || [] };
  }



  render() {
      this.columns = [];
      let data = this.applyFiltersToData();
      console.log('containers.search.results.ConfigurableTable.render()[newData]', data);
      console.log('containers.search.results.ConfigurableTable.render()[filters]', this.filters);
      
      this.buildConfig(this.props.config, data);
      console.log('containers.search.results.ConfigurableTable.render()[props]', this.props);
      console.log('containers.search.results.ConfigurableTable.render()[state]', this.state);
      console.log('containers.search.results.ConfigurableTable.render()[columns]', this.columns);
      if(this.state.data.length > 0)
      {
        return(
            <Table columns      = { this.state.columns } 
                   dataSource   = { this.state.data }
                   size         = 'small'
                   scroll       = { this.scroll } 
                   loading      = { this.props.isSearching }
                   rowClassName = { ( record, index ) => { return 'small-table-line'; } } 
                   onChange     = { (pagination, filters, sorter) => this.handleTableChange(pagination, filters, sorter) }
                   pagination   = { this.state.pagination } />
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