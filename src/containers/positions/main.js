import React                                                from 'react';
import PropTypes                                            from 'prop-types';
import { Row, Col, Button, Spin,  }                         from 'antd';
import ConfigurableTable                                    from '../search/results/configurableTable';
import { loadItems }                                        from '../../actions/positions/main';

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
    return (
        <Spin spinning = { this.props.positions.isLoading } >
            <Row className = 'positionsTableToolbar' >
                    <Col span      = { 24 }
                        className = 'positionsTableToolbar' >
                        Reserved for toolbar
                    </Col>
            </Row>
            <Row className = 'positionsTable' >    
                <Col span      = { 24 }
                    className = 'positionsTable' >
                    <ConfigurableTable  isSearching = { false }
                                        config      = { this.props.configs.tableConfigs.find( config => config.type === 'POS' ) }
                                        results     = { this.props.positions.items }
                                        isEditable  = { this.props.isEditable } />
                </Col>
            </Row>
        </Spin>);
  } 
}