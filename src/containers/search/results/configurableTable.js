import React                            from 'react';
import PropTypes                        from 'prop-types'
import { Table, Icon, Button, Popover, Input } from 'antd';
import { addPositionItem }              from '../../../actions/positions/addPosition';
import Column                           from '../../../components/column';


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
                                addonAfter = { <Icon type="plus-circle-o" onClick = { (e) => { this.onAddClick(record) } } />}
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
        if(column.visible === true)
        {
            column.className = 'table-actions-without-padding';
            
            column.sorter = function(a, b) {
                console.log(this);
            }

            column.sorter = column.sorter.bind(column);

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
      this.columns = [];
      this.buildConfig(props.config);
  }

  componentWillReceiveProps(newProps)
  {
    this.buildConfig(newProps.config);
  }


  render() {
      console.log('containers.search.results.ConfigurableTable.render()[props]', this.props);
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