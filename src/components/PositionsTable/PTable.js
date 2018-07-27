import React                    from 'react';
import { Table, Alert }         from 'antd';
import PropTypes                from 'prop-types';
import { FixedHeader }          from '../.';

const components = {
  header: {
    cell: FixedHeader,
  },
};

const defaultOnSelectChange = (keys, records) => {
  console.log('PTable: not defined customer onSelectChange!');
}

export class PTable extends React.Component {
  static propTypes = {   
    data:             PropTypes.array.isRequired,
    columns:          PropTypes.array.isRequired,
    selections:       PropTypes.arrayOf(PropTypes.shape({
      text:           PropTypes.string.isRequired,
      onSelect:       PropTypes.func.isRequired,
    })).isOptional,
    selectedRowKeys:  PropTypes.array.isOptional,
    onSelectChange:   PropTypes.func.isRequired,
    loading:          PropTypes.bool.isOptional,
  }

  state = {
    selections: [],
    selectedRowKeys: [],
  };

  onSelectChange = defaultOnSelectChange;
 
  getRowClassName = (record, index) =>
  {
    return 'small-table-line';
  }

  componentWillReceiveProps = (newProps) => {
    //если переданы кастомные селекты строк
    if(newProps.selections !== this.state.selections)
    {
      if(newProps.selections.length > 0)
      {
        this.setState( {
          selections: newProps.selections.map((selection, index) => {
            return {
              key: index.toString(),
              text: selection.text,
              onSelect: selection.onSelect,
            }
          }) } );
      }
    }

    //если переданы ключи выделенных строк
    if(newProps.selectedRowKeys !== this.state.selectedRowKeys)
    {
      this.setState( {selectedRowKeys: newProps.selectedRowKeys} );
    }

    //устанавливаем обработчик для выделения строк
    if(newProps.onSelectChange !== this.state.onSelectChange)
    {
      if(typeof newProps.onSelectChange === 'function')
      {
        this.onSelectChange = newProps.onSelectChange;
      }
    }
  }

  render = () => {
    const { selectedRowKeys, selections } = this.state;

    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
      selections,
      columnWidth: '35px',
    };

    if(this.props.data && this.props.data.length > 0)
    {
      return (
        <Table 
          className     = 'very-small-table'
          rowSelection  = { rowSelection } 
          columns       = { this.props.columns } 
          dataSource    = { this.props.data }
          rowClassName  = { this.getRowClassName } 
          loading       = { this.props.loading }
          components    = { components }
          onChange      = { onChange }
          indentSize    = { 0 }
          size          = 'small' />
      );
    }
    return(
      <Alert
        message = 'Ничего не найдено'
        type    = 'info'
        style   = {{ margin: 8 }}
      />
    );
  }

}

function onChange(pagination, filters, sorter) {
  console.log('params', pagination, filters, sorter);
}

export default PTable;