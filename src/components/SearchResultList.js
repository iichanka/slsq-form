import React              from 'react';
import { Table }          from 'antd';
import PropTypes          from 'prop-types';

export class SearchResultList extends React.Component {
  static propTypes = {   
    data:           PropTypes.array.isRequired,
    columns:        PropTypes.array.isRequired,
    onSelect:       PropTypes.func.isRequired,
  }

  constructor(props)
  {
    super(props);
  }

  getRowClassName = (record, index) =>
  {
    return 'small-table-line';
  }

  render()
  {
    let onSelect = this.props.onSelect;
    if(typeof onSelect !== 'function')
    {
      onSelect = (record) => { console.log('SearchResultList: not defined onSelect callback') };
    }

    return(
      <Table 
        className     = 'very-small-table'
        dataSource    = { this.props.data }
        columns       = { this.props.columns.map(column => { column.sorter = (a,b) => { return ('' + a[column.dataIndex]).localeCompare(b[column.dataIndex]); };  return column  }) }
        onRow         = { (record) => { return { onClick: () => { onSelect(record); } } } }
        rowClassName  = { this.getRowClassName } 
        scroll        = { { x: true, y: '100%' } }
        size          = 'small'/>
    );
  }
}

export default SearchResultList;