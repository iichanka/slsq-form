import React                                                from 'react';
import PropTypes                                            from 'prop-types';
import { Row, Col, Button, Spin, Popover }                  from 'antd';
import ConfigurableTable                                    from '../configurableTable';
import { loadItems }                                        from '../../actions/positions/main';
import { calcPositionSum }                                  from '../../actions/positions/calcPositionsSum';

export default class PositionsConainer extends React.Component {
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
    console.log('containers.positions.main.PositionContainer.componentDidMount()[props]:', this.props);
    const { dispatch } = this.props
    dispatch(loadItems());
  }

  onCalcPositionsSum()
  {
    const { dispatch } = this.props
    dispatch(calcPositionSum());
  }

 /*  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(loadItems(dispatch));
  } */

  /* getDefaultValueKey(items)
  {
    console.log('containers.search.criterias.searchButtonBox.getDefaultValueKey()[items]:', items);
    let selectedItemID;
    items.find(item => {
      if(item.selected === true)
      {
        selectedItemID = item.id;
        return true;
      }
    })
    console.log('containers.search.criterias.searchButtonBox.getDefaultValueKey()[result]:', selectedItemID);
    return selectedItemID;
  }

  onSelect(itemID)
  {
    const { dispatch } = this.props;
    dispatch(selectItem(itemID));
  }

  onSearch()
  {
    const { dispatch } = this.props;
    dispatch(search());
  } */

  render() {
    console.log('containers.positions.main.PositionsConatainer.render()[props]:', this.props);

    const msg = {
      content: (
          <div>
              <p>Форма заявки находится в режиме просмотра.</p>
              <p>Чтобы перейти в режим редактирования нажмите кнопку "Обработать".</p>
          </div>),
      title: 'Рассчет цен недоступен',
    }

    return (
        <div className = 'positions-box' >
          <Spin spinning = { this.props.positions.isLoading } >
              <Row className = 'positionsTableToolbar' >
                      <Col span     = { 24 } >
                          { this.props.isEditable &&
                          <Button type     = "primary" 
                                  icon     = "reload" 
                                  loading  = { this.props.positions.isLoading }
                                  style    = {{ float: 'right' }}
                                  onClick  = { (event) => { this.onCalcPositionsSum(); } }  >
                              Рассчитать цены
                            </Button>
                          }
                          { !this.props.isEditable &&
                            <Popover content = { msg.content }
                                    title   = { msg.title } >
                              <Button type     = "primary" 
                                      icon     = "frown-o"
                                      loading  = { this.props.positions.isLoading }
                                      style    = {{ float: 'right' }}
                                      onClick  = { (event) => { this.onCalcPositionsSum(); } }
                                      disabled  >
                                  Рассчитать цены
                              </Button>
                            </Popover>
                          }
                      </Col>
              </Row>
              <Row className = 'positionsTable' >    
                  <Col span      = { 24 }
                      className = 'positionsTable' >
                      <ConfigurableTable  isSearching = { false }
                                          config      = { this.props.configs.tableConfigs.find( config => config.type === 'POS' ) }
                                          results     = { this.props.positions.items }
                                          isEditable  = { this.props.isEditable }
                                          dispatch    = { this.props.dispatch } />
                  </Col>
              </Row>
          </Spin>
        </div>);
  } 
}