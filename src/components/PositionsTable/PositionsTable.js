import React                    from 'react';
import PropTypes                from 'prop-types';
import { PTable, Cell }         from '.';


const defaultOnSelectChange = (keys, records) => {
  console.log('PositionsTable: not defined customer onSelectChange!');
}

export class PositionsTable extends React.Component {
  static propTypes = { 
    editMode:         PropTypes.bool.isRequired,  
    data:             PropTypes.array.isRequired,
    columns:          PropTypes.array.isRequired,
    onSelectChange:   PropTypes.func.isRequired,
    loading:          PropTypes.bool.isOptional,
    config:           PropTypes.shape({
      columns:        PropTypes.array.isRequired,
      pageSize:       PropTypes.number.isRequired,
      type:           PropTypes.string.isRequired,
      default:        PropTypes.bool.isRequired,
    })
  }

  state = {
    selections: [
      {
        key: '1',
        text: 'Выделить материалы',
        onSelect: (changeableRowKeys) => { this.onSelectMaterials(changeableRowKeys) },
      },

      {
        key: '2',
        text: 'Выделить услуги',
        onSelect: (changeableRowKeys) => { this.onSelectServices(changeableRowKeys) },
      },

      {
        key: '3',
        text: 'Выделить автодоставки',
        onSelect: (changeableRowKeys) => { this.onSelectAutoDelivery(changeableRowKeys) },
      }
    ],
    selectedRowKeys: [],
    columns: [],
    config: null,
    editMode: false,
  };

  constructor(props)
  {
    super(props);
    this.config = props.config;
  }

  //пользовательский обработчик изменения списка выделенных позиций
  customerOnSelectChange = defaultOnSelectChange;

  //изменение списка выделенных позиций
  onSelectChange = (keys, records) => {
    this.setState({ selectedRowKeys: keys });
    this.customerOnSelectChange(keys, records);
  }

  //выделение позиций-материалов
  onSelectMaterials = (changeableRowKeys) => {
    console.log('PositionTable->onSelectMaterials(changeableRowKeys)', changeableRowKeys);
    this.setState({selectedRowKeys: []});
  }

  //выделение позиций-услуг
  onSelectServices = (changeableRowKeys) => {
    console.log('PositionTable->onSelectServices(changeableRowKeys)', changeableRowKeys);
    this.setState({selectedRowKeys: []});
  }

  //выделение позиций-автодоставок
  onSelectAutoDelivery = (changeableRowKeys) => {
    console.log('PositionTable->onSelectAutoDelivery(changeableRowKeys)', changeableRowKeys);
    this.setState({selectedRowKeys: []});
  }


  componentWillReceiveProps = (newProps) => {
    //есть кастомный обработчик изменения списка позиций
    let needRebuildColumns = false;
    if(newProps.onSelectChange !== this.customerOnSelectChange)
    {
      if(typeof newProps.onSelectChange === 'function')
      {
        this.customerOnSelectChange = newProps.onSelectChange;
      }
    }

    //изменение конфига
    if(newProps.config && this.state.config !== newProps.config)
    {
      this.setState(
        { 
          config: newProps.config, 
        });

        needRebuildColumns = true;
    }

    //изменение режима
    if(newProps.editMode != this.state.editMode)
    {
      this.setState({ editMode: newProps.editMode });
      //needRebuildColumns = true;
    }


    if(needRebuildColumns)
    {
      this.setState({columns: this.buildColumns(newProps.config.columns)});
    }
  }

  buildColumns = (originalColumns = []) =>
  {
    return originalColumns.map(column => {
      if(column.visible)
      {
        //quantity, integers and floats - right align
        let columnAlign = 
          column.data_type === 'Q' || 
          column.data_type === 'F' ||
          column.data_type === 'I' ? 'right' : 'left';

        column.render = (text, record) => 
          <Cell 
            editMode    = { this.props.editMode }
            isEditable  = { column.editable }
            data        = { record } 
            align       = { columnAlign } 
            width       = { column.width }
            dataIndex   = { column.dataIndex }>
            { text }
          </Cell>

        return column;
      }
      return null;
    }).filter(column => !!column);
  }


  render = () => {
    return(      
      <PTable
        selections      = { this.state.selections }
        data            = { this.props.data }
        columns         = { this.state.columns }
        selectedRowKeys = { this.state.selectedRowKeys }
        onSelectChange  = { this.onSelectChange }
        loading         = { this.props.loading }
        />
    );
  }
}

export default PositionsTable;