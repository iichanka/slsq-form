import React                                  from 'react';
import PropTypes                              from 'prop-types';
import { Menu, Spin, Checkbox }               from 'antd';
import { loadItemsIfNeeded, selectCategory }  from '../../../../actions/search/criterias/hierarchy';

const SubMenu       = Menu.SubMenu;

class HierarchyMenu extends React.Component {
  static propTypes = {
    isLoading:        PropTypes.bool.isRequired,
    items:            PropTypes.array.isRequired,
    dispatch:         PropTypes.func.isRequired,
  }

  rootSubmenuKeys = [];

  state = {
    openKeys: []
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(loadItemsIfNeeded(-1))
  }

  componentWillReceiveProps(nextProps) {
    if(!this.props.items || ( this.props.items.length === 0 && nextProps.items.length !== 0))
    {
      if(nextProps.items)
      {
        this.rootSubmenuKeys = nextProps.items.filter(item => item.parent === -1);
      }
    }
  }

  onSelect = (item, key, selectedKeys) => {
    const { dispatch } = this.props;
    if(item)
    {
      if(item.key)
      {
        let itemID = parseInt(item.key, 10);
        dispatch(loadItemsIfNeeded(itemID));
        dispatch(selectCategory(itemID));
      }
    }
  }


  onOpenChange = (openKeys) => {
    const { dispatch, selectedCategoryItemIDs } = this.props;
    let latestOpenKey = openKeys.find(key => this.state.openKeys.indexOf(key) === -1);
    let latestOpenKeyInt = parseInt(openKeys.find(key => this.state.openKeys.indexOf(key) === -1));

    if(latestOpenKey)
    {
      dispatch(loadItemsIfNeeded(latestOpenKeyInt));
      this.setState({
        openKeys
      });
    }
  }

  onCheck = (item, checked) => 
  {
    const { dispatch } = this.props;
    dispatch(selectCategory(item.id));
  }

  getChilds = (itemID) =>
  {
    let subMenuItems = this.props.items.filter( item => item.parent === itemID ) || [];
    let result = [];
    if(subMenuItems.length > 0)
    {
      subMenuItems.map(item => {
        let className = 'my-menu';

        if(item.selected)
        {
          className = 'my-menu submenu-selected';
        }

        if(item.haveChilds)
        {
          result.push(
            <SubMenu 
              key   = { item.id } 
              title = { <Checkbox 
                          indeterminate = { item.indeterminate }
                          checked       = { item.selectedAll } 
                          onChange      = { e => { e.preventDefault(); this.onCheck(item, e.target.checked) } } >
                          { item.title }
                        </Checkbox> }
              className = { className } >
              { this.getChilds(item.id) }
            </SubMenu>);
        }
        else
        {
          result.push(
            <Menu.Item 
              key     = { item.id } 
              style   = {{ margin: 0 }} 
              className = { className }>
                <Checkbox 
                  checked       = { item.selected } 
                  onChange      = { e => { e.preventDefault(); this.onCheck(item, e.target.checked) } }>
                  { item.title }
                </Checkbox>
            </Menu.Item>);
        }
      })
    }
    return result;
  }

  render() {
    return (
      <Spin spinning={this.props.isLoading}>
        <Menu
          mode="inline"
          /* openKeys={this.state.openKeys} */
          onOpenChange={this.onOpenChange}
          /* onSelect={this.onSelect} */
          style={{ margin: 0 }}
          className = 'scrollable-y searchPanelTabHeight'
          inlineIndent = "8"
        >
          { this.getChilds(-1) }
        </Menu>
      </Spin>);
  }
}


export {
  HierarchyMenu,
}
export default
{
  HierarchyMenu,
}
