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
    this.columns = config.columns.map(column => {
        return column;
    })

    if(config.type = 'RFR')
    {
        this.columns.push({
            key:    'actions',
            title:  'Действия',
            render: (text, record) => {
                console.log('containers.search.results.ConfigurableTable.renderActions()[record]', record);
                return(
                    <Button shape   = "circle" 
                            icon    = "plus-circle-o"
                            onClick = { event => { this.onAddClick(record.key) } } />
                );
            }
        });
    }
  }

  onAddClick = (key) => {
    console.log('containers.search.results.ConfigurableTable.onAddClick()[key]', key);
  }

  constructor(props)
  {
      super(props);
      this.buildConfig(props.config);
  }


  render() {
      console.log('containers.search.results.ConfigurableTable.render()[props]', this.props);
      console.log('containers.search.results.ConfigurableTable.render()[columns]', this.columns);
      return(
        <Table columns      = { this.columns } 
               dataSource   = { this.props.results } />
      );
  };
}