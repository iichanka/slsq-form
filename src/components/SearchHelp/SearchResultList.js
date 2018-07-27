import React              from 'react';
import { Table }          from 'antd';
import PropTypes          from 'prop-types';
import { FixedHeader }    from '..';

const components = {
  header: {
    cell: FixedHeader,
  },
};

const defaultOnSelect = (keys, records) => {
  console.log('SearchResultList: not defined onSelect callback');
}

export class SearchResultList extends React.Component {
  static propTypes = {   
    data:           PropTypes.array.isRequired,
    columns:        PropTypes.array.isRequired,
    onSelect:       PropTypes.func.isRequired,
    loading:        PropTypes.bool.isOptional,
    multiple:       PropTypes.bool.isOptional,
  }

  constructor(props)
  {
    super(props);
  }

  getRowClassName = (record, index) =>
  {
    return 'small-table-line';
  }

  rowSelection = {
    onChange: defaultOnSelect,
  }

  onSelect = defaultOnSelect;


  componentWillReceiveProps(newProps)
  {
    if(typeof newProps.onSelect === 'function')
    {
      this.onSelect = newProps.onSelect;
    }
    if(newProps.multiple)
    {
      this.rowSelection = { onChange: this.onSelect }
    }
  }

  render()
  {
    let loading   = this.props.loading ? this.props.loading : false;
   
    if(this.props.multiple)
    {
      return(
        <Table 
          className     = 'very-small-table'
          dataSource    = { this.props.data }
          columns       = { this.props.columns.map(column => { column.sorter = (a,b) => { return ('' + a[column.dataIndex]).localeCompare(b[column.dataIndex]); };  return column  }) }
          rowSelection  = { this.rowSelection }
          rowClassName  = { this.getRowClassName } 
          scroll        = { { x: true, y: '100%' } }
          components    = { components }
          pagination    = { false }
          loading       = { loading }
          size          = 'small'/>  
      );
    }

    return(
      <Table 
        className     = 'very-small-table'
        dataSource    = { this.props.data }
        columns       = { this.props.columns.map(column => { column.sorter = (a,b) => { return ('' + a[column.dataIndex]).localeCompare(b[column.dataIndex]); };  return column  }) }
        onRow         = { (record) => { return { onClick: () => { this.onSelect([record.key], [record]); } } } }
        rowClassName  = { this.getRowClassName } 
        scroll        = { { x: true, y: '100%' } }
        components    = { components }
        pagination    = { false }
        loading       = { loading }
        size          = 'small'/>
    );
  }
}

export default SearchResultList;