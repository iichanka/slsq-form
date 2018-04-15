import React                          from 'react';
import PropTypes                      from 'prop-types'
import { Table, Icon, Button }        from 'antd';



export default class ConfigurableTable extends React.Component {
  static PropTypes = {
    isSearching:        PropTypes.bool.isRequired,
    config:             PropTypes.object.isRequired,
    results:            PropTypes.array.isRequired,
  }

  buildConfig = (config) => {
    console.log('containers.search.results.ConfigurableTable.buildConfig()[config]', config);
    if(config.columns.length > 0)
    {
        this.columns = [];
        this.columns.push({
            key:    'actions',
            title:  'Действия',
            width:  50,
            render: (text, record) => {
                return(
                    <Button shape   = "circle" 
                            icon    = "plus-circle-o"
                            onClick = { event => { this.onAddClick(record.key) } } />
                );
            }
        });
    }

    /* if(config.type === 'RFR' && this.columns.length > 0)
    {
        this.columns.push({
            key:    'actions',
            title:  'Действия',
            render: (text, record) => {
                return(
                    <Button shape   = "circle" 
                            icon    = "plus-circle-o"
                            onClick = { event => { this.onAddClick(record.key) } } />
                );
            }
        });
    } */

    config.columns.map(column => {
        if(column.visible === true)
        {
            this.columns.push(column);
        }
    })
  }

  onAddClick = (key) => {
    console.log('containers.search.results.ConfigurableTable.onAddClick()[key]', key);
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
                   scroll       = {{ y: 217, x: '100%' }} 
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