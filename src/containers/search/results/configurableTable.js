import React                            from 'react';
import PropTypes                        from 'prop-types'
import { Table, Icon, Button, Popover } from 'antd';



export default class ConfigurableTable extends React.Component {
  static PropTypes = {
    isSearching:        PropTypes.bool.isRequired,
    config:             PropTypes.object.isRequired,
    results:            PropTypes.array.isRequired,
    isEditable:         PropTypes.bool.isRequired,
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
        width:  50,
        render: (text, record) => {
            if(this.props.isEditable)
            {
                return(
                    <Button shape   = "circle" 
                            icon    = "plus-circle-o"
                            onClick = { event => { this.onAddClick(record) } } />
                );
            }
            return(
                <Popover content = { msg.content }
                            title   = { msg.title } >
                    <Button shape   = "circle" 
                            icon    = "plus-circle-o"
                            disabled />
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
    console.log('containers.search.results.ConfigurableTable.onAddClick()[record]', record);
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
                   loading      = { this.props.isSearching }/>
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