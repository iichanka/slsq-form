import React                            from 'react'
import PropTypes                        from 'prop-types'
import { Checkbox, Spin, Tooltip, Row } from 'antd';
import { toggleClassificatorItem, 
         selectClassificatorItems }     from '../../../../actions/search/criterias/classificator';
import { AttributeGroup }                   from '../../../../components';

export default class ClassificatorAttributesList extends React.Component {
  static propTypes = {
    items:          PropTypes.array.isRequired,
    isLoading:      PropTypes.bool.isRequired,
    dispatch:       PropTypes.func.isRequired,
    selectedClass:  PropTypes.number.isRequired
  }

  itemsForShow = [];

  constructor(props)
  {
    super(props);
    this.onToggleItem  = this.onToggleItem.bind(this);
    this.onToggleGroup = this.onToggleGroup.bind(this);
  }

  sliceItemsByGroup(items = [])
  {
    let index       = -1;
    let start       = 0;
    let end         = 0;
    let indexes     = [];
    let lastGroupID = -1;

    this.itemsForShow = [];

    items.map(item => {
      index ++;
      if(item.group_id !== lastGroupID)
      {
        indexes.push(index);
        lastGroupID = item.group_id;
      }
    })

    index = 0;
    indexes.map(ind => {
      index ++;
      start = ind;
      end = (indexes[index]) ? indexes[index] : items.length;
      this.itemsForShow.push(items.slice(start, end))
    })
  }

  componentWillReceiveProps(nextProps) {
    console.log('containers.search.criterias.classificator.atrributesList.componentWillReceiveProps()[props]:', this.props);
    console.log('containers.search.criterias.classificator.atrributesList.componentWillReceiveProps()[nextProps]:', nextProps);

    if(this.props.selectedClass && nextProps.selectedClass
        && this.props.items && nextProps.items)
    {
      if((this.props.selectedClass !== nextProps.selectedClass) ||
         (this.props.items.length !== nextProps.items.length))
      {
        this.sliceItemsByGroup(nextProps.items.filter(item => item.parent === nextProps.selectedClass))
      }
    }
  }

  onToggleItem(itemID)
  {
    this.props.dispatch(toggleClassificatorItem(itemID));
  }

  onToggleGroup(groupID, selectAll = true)
  {
    let itemsIDs = [];
    this.itemsForShow.find(items => {
      if(items[0].group_id === groupID)
      {
        items.map( item => {
          if(item.selected !== selectAll)
          {
            itemsIDs.push(item.id);
          }
        })
        return true;
      }
      return false;
    });

    this.props.dispatch(selectClassificatorItems(itemsIDs, selectAll));
  }

  getWrapperWidth()
  {
    let percentage = this.itemsForShow.length * (100 + 8);
    return percentage + 'px';
  }

  render() {
    console.log('containers.search.criterias.classificator.atrributesList.render()[props]:', this.props);
    return(
        <Spin spinning={this.props.isLoading}>
          <Row  className = 'scrollable-x searchPanelTabHeight'>
            <div style={{maxWidth: this.getWrapperWidth(), minWidth: this.getWrapperWidth(), whiteSpace: 'nowrap'}}>
              { this.itemsForShow.map(items =>
                  <AttributeGroup
                        attributes = {items}
                        onToggleAttribute = {this.onToggleItem}
                        onToggleAll = {this.onToggleGroup} />
                )
              }
            </div>
          </Row>
        </Spin>);
  }
}
