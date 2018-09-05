import React                                                from 'react';
import PropTypes                                            from 'prop-types';
import { Row, Col, Button, Spin, Popover, Divider, Menu, Dropdown, Icon }         from 'antd';
import ConfigurableTable                                    from '../configurableTable';
import { loadItems }                                        from '../../actions/positions/main';
import { calcPositionSum }                                  from '../../actions/positions/calcPositionsSum';
import { updatePositions }                                  from '../../actions/positions/updatePositions';
import { deletePositions }                                  from '../../actions/positions/deletePositions';
import { PositionsTable } from '../../components/PositionsTable/PositionsTable';
import { Sbuttons } from '../../components/PositionsTable/Sbuttons';

export class PositionsConainer extends React.Component {
  static propTypes = {   
    positions:      PropTypes.object.isRequired,
    configs:        PropTypes.object.isRequired,
    isEditable:     PropTypes.bool.isRequired,
    dispatch:       PropTypes.func.isRequired,
  }
  
  constructor(props)
  {
    super(props);
  }

  componentDidMount() {
    const { dispatch } = this.props
    dispatch(loadItems());
  }

  onCalcPositionsSum()
  {
    const { dispatch } = this.props
    dispatch(calcPositionSum());
  }

  onPositionDelete(record)
  {
    const { dispatch } = this.props
    let records = [];
    records.push(record);

    dispatch(deletePositions(records));
  }

  onPositionUpdate(record)
  {
    const { dispatch } = this.props
    let records = [];
    records.push(record);

    dispatch(updatePositions(records));
  }

  onPositionsUpdateAll(records)
  {
    const { dispatch } = this.props
    console.log('onPositionsUpdateAll(records)', records);
    dispatch(updatePositions(records));
  }

  addActions(config, isEditable, columns = [])
  {
    if(columns.length === 0 || !isEditable)
    {
      return;
    }

    if(config.type === 'POSITIONS')
    {
      columns.push({
        key:    'actions',
        title:  'Действия',
        width:  200,
        className: 'table-actions-without-padding',
        onHeaderCell: (cell) => {
          return {
            width: 200,
            title: 'Действия',
          }
        },
        render: (text, record) => {
          return(
              <span>
                <a onClick = { event => { this.onPositionDelete(record) }} >Удалить</a>
                {
                  record.isModified &&
                  <span>
                    <Divider type="vertical" />
                    <a onClick = { event => { this.onPositionUpdate(record) } }>Обновить</a>
                  </span>
                }              
              </span>
          ); 
        }
      });
    }
  }

  handleMenuClick = () => {};

  menu = (
    <Menu onClick={ this.handleMenuClick }>
      <Menu.Item key="1">??? 1</Menu.Item>
      <Menu.Item key="2">??? 2</Menu.Item>
      <Menu.Item key="3">??? 3</Menu.Item>
    </Menu>
  );


  render() {
    const msg = {
      content: (
          <div>
              <p>Форма заявки находится в режиме просмотра.</p>
              <p>Чтобы перейти в режим редактирования нажмите кнопку "Обработать".</p>
          </div>),
      title: 'Рассчет цен недоступен',
    }

    

    return (
      <div>        
        <div className = 'positions-box' >
          <Spin spinning = { this.props.positions.isLoading } >
          
              <Row className = 'positionsTable' >    
                  <Col span      = { 24 }
                      className = 'positionsTable' >
                      <Sbuttons editMode = { this.props.isEditable }/>
                      <PositionsTable
                        editMode                = { this.props.isEditable }
                        config                  = { this.props.configs.tableConfigs.find( config => config.type === 'POSITIONS' && config.default ) }
                        data                    = { this.props.positions.items } 
                        />
{/*                       <ConfigurableTable  isProcessing            = { false }
                                          config                  = { this.props.configs.tableConfigs.find( config => config.type === 'POSITIONS' ) }
                                          data                    = { this.props.positions.items }
                                          isEditable              = { this.props.isEditable }
                                          isPersonalizationActive = { this.props.configs.isPersonalizationActive }
                                          dispatch                = { this.props.dispatch }
                                          modifyColumns           = { this.addActions.bind(this) }
                                          onPositionDelete        = { this.onPositionDelete.bind(this) }
                                          onPositionUpdate        = { this.onPositionUpdate.bind(this) }
                                          onPositionsUpdateAll    = { this.onPositionsUpdateAll.bind(this) } /> */}
                  </Col>
              </Row>
          </Spin>
        </div>
      </div>);
  } 
}

export default PositionsConainer;