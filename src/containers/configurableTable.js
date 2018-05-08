import React                            from 'react';
import PropTypes                        from 'prop-types'
import {  Table, Icon, Button, 
          Popover, Input, Row, Col }    from 'antd';
import { addPositionItem }              from '../actions/positions/addPosition';

const Search = Input.Search;

const initialState = {
  filtered: [],
  sorted: [],
  dropdownVisible: [],
};

export default class ConfigurableTable extends React.Component {
  static PropTypes = {
    isSearching:        PropTypes.bool.isRequired,
    config:             PropTypes.object.isRequired,
    results:            PropTypes.array.isRequired,
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
        width:  100,
        className: 'table-actions-without-padding',
        render: (text, record) => {
            if(this.props.isEditable)
            {
                return(
                    <div>
                        <Input  size = "small" 
                                placeholder = "0.00"
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
    return this.props.results.map( record => {
      this.filters.forEach(filter => {
        if(filter.values.indexOf(record[filter.field]) === -1)
        {
          console.log('HIT!');
          return null;
        }
      });
      return record
    }).filter( record => !!record );
  }

  buildDropdown(column)
  {
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
              onSearch    = { value => { this.filters.push({ field: column.dataIndex, values: [ {value}] }) } }
              size        = 'small'
              enterButton
            />
          </Col>
        </Row>
      </div>
    );
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
  buildConfig = (config = {columns:[], type: ''}) => {
    console.log('containers.search.results.ConfigurableTable.buildConfig()[config]', config);
    switch(config.type)
    {
        case 'RFR':
        case 'RFIT':
        case 'RFM':
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

            column.filterDropdown         = this.buildDropdown(column);
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
            case 'RFR':
            case 'RFIT':
            case 'RFM':
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
            case 'RFR':
            {
                dispatch(addPositionItem({ remnants: {...record, count: input.value } }));
            }
        }

        
    }
  }

  handleTableChange(pagination, filters, sorter) {
    console.log('containers.search.results.ConfigurableTable.handleTableChange()', pagination, filters, sorter);
  }

  constructor(props)
  {
      super(props);
      
      this.state = initialState;
  }

  componentWillReceiveProps(newProps)
  {
    //this.buildConfig(newProps.config);
  }


  render() {
      this.columns = [];
      let data = this.applyFiltersToData();
      console.log('containers.search.results.ConfigurableTable.render()[newData]', data);
      console.log('containers.search.results.ConfigurableTable.render()[filters]', this.filters);
      
      this.buildConfig(this.props.config);
      console.log('containers.search.results.ConfigurableTable.render()[props]', this.props);
      console.log('containers.search.results.ConfigurableTable.render()[state]', this.state);
      console.log('containers.search.results.ConfigurableTable.render()[columns]', this.columns);
      if(this.props.results.length > 0)
      {
        return(
            <Table columns      = { this.columns } 
                   dataSource   = { this.props.results }
                   size         = 'small'
                   scroll       = { this.scroll } 
                   loading      = { this.props.isSearching }
                   rowClassName = { ( record, index ) => { return 'small-table-line'; } } 
                   onChange     = { (pagination, filters, sorter) => this.handleTableChange(pagination, filters, sorter) }/>
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