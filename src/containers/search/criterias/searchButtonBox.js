import React                                              from 'react';
import PropTypes                                          from 'prop-types';
import { Row, Col, Button, Select, Spin, Popover, Icon }  from 'antd';
import { loadItems, selectItem }                          from '../../../actions/search/criterias/locations';
import { search }                                         from '../../../actions/search/main';
import { clearCriterias }                                 from '../../../actions/search/criterias/main';

const Option      = Select.Option;
const ButtonGroup = Button.Group;

export default class SearchButtonBox extends React.Component {
  static propTypes = {
    isSearching:    PropTypes.bool.isRequired,
    criterias:      PropTypes.object.isRequired,
    dispatch:       PropTypes.func.isRequired,
  }
  
  constructor(props)
  {
    super(props);
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(loadItems(dispatch));
  }

  getDefaultValueKey(items)
  {
    let selectedItemID;
    items.find(item => {
      if(item.selected === true)
      {
        selectedItemID = item.id;
        return true;
      }
    })

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
  }

  onClear()
  {
    const { dispatch } = this.props;
    const { activeTab } = this.props.criterias.activeTab;
    dispatch(clearCriterias(activeTab));
  }

  render() {
    return (
      <Row>
        <Col span      = { 16 }
             className = 'searchCriteriasButtonBox' >
          <Spin spinning = { this.props.criterias.locations.isLoading } >
            <Select onChange      = { key => { this.onSelect(parseInt(key)) } }
                    value         = { this.getDefaultValueKey(this.props.criterias.locations.items) } 
                    style         = {{ width: 'calc(100% - 10px)', margin: '5px' }} >
              {
                this.props.criterias.locations.items.map(item => {
                  return(
                    <Option value = { item.id }>
                      { item.title }
                    </Option>
                  );
                })
              }
            </Select>
          </Spin>
        </Col>
        <Col span = { 8 } 
             className = 'searchCriteriasButtonBox' >
        <ButtonGroup style = {{ float: 'right', margin: '5px' }} >
          <Popover content = 'Очистить все ранее выбранные критерии поиска' 
                   title   = "Сбросить">
            <Button type = 'danger'
                    icon = 'delete'
                    onClick = { event => this.onClear() } >
            </Button>
          </Popover>
          <Button type    = 'primary'
                  icon    = 'search'
                  loading = { this.props.isSearching === true }
                  onClick = { ev => this.onSearch() } >
            Поиск
          </Button>
        </ButtonGroup>
        </Col>
      </Row>);
  }
}
