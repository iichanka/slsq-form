import React                              from 'react'
import { Menu, Spin, Tooltip }            from 'antd';
import { loadItemsIfNeeded, selectClass } from '../../../../actions/search/criterias/classificator';

const SubMenu = Menu.SubMenu;

export default class ClassificatorMenu extends React.Component {
  rootSubmenuKeys = [];

  state = {
    openKeys: []
  };

  componentDidMount() {
    console.log('containers.search.criterias.classificator.menu.componentDidMount()[props]:', this.props);
    const { dispatch } = this.props
    dispatch(loadItemsIfNeeded(-1))
  }

  componentWillReceiveProps(nextProps) {
    console.log('containers.search.criterias.classificator.menu.componentWillReceiveProps()[props]:', this.props);
    console.log('containers.search.criterias.classificator.menu.componentWillReceiveProps()[nextProps]:', nextProps);
    if(!this.props.items || ( this.props.items.length == 0 && nextProps.items.length != 0))
    {
      if(nextProps.items)
      {
        this.rootSubmenuKeys = nextProps.items.filter(item => item.parent == -1);
      }
    }
  }

  onSelect = (item, key, selectedKeys) => {
    const { dispatch } = this.props;
    if(item)
    {
      if(item.key)
      {
        let itemID = parseInt(item.key);
        dispatch(loadItemsIfNeeded(itemID));
        dispatch(selectClass(itemID));
      }
    }
  }


  onOpenChange = (openKeys) => {
    const { dispatch } = this.props;
    let latestOpenKey = openKeys.find(key => this.state.openKeys.indexOf(key) === -1);
    let latestOpenKeyInt = parseInt(openKeys.find(key => this.state.openKeys.indexOf(key) === -1));

    if(latestOpenKey)
    {
      dispatch(loadItemsIfNeeded(latestOpenKeyInt));
      this.setState({
        openKeys: [latestOpenKey]
      });
    }
    else {
      this.setState({
        openKeys: []
      });
    }
  }

  render() {
    console.log('containers.search.criterias.classificator.menu.render()[props]:', this.props);
    let rootSubmenuKeysElements = [];
    for(let i = 0; i < this.rootSubmenuKeys.length; i++)
    {
      let submenuKeys = this.props.items.filter(item => item.parent === this.rootSubmenuKeys[i].id );
      let submenuKeysElements = [];
      for(let j = 0; j < submenuKeys.length; j ++)
      {
          let title = (submenuKeys[j].title.length >= 14) ? <Tooltip placement="topLeft" mouseLeaveDelay={0} title={submenuKeys[j].title}>{submenuKeys[j].title}</Tooltip> : submenuKeys[j].title;
          submenuKeysElements.push(<Menu.Item key={submenuKeys[j].id} style={{margin: 0}} className = 'my-menu'>{title}</Menu.Item>);
      }
      rootSubmenuKeysElements.push(
        <SubMenu key={this.rootSubmenuKeys[i].id} title={this.rootSubmenuKeys[i].title}
                 className = 'my-menu' >
          {submenuKeysElements}
        </SubMenu>);
    }

    return (
      <Spin spinning={this.props.isLoading}>
        <Menu
          mode="inline"
          openKeys={this.state.openKeys}
          onOpenChange={this.onOpenChange}
          onSelect={this.onSelect}
          style={{ margin: 0 }}
          className = 'scrollable-y searchPanelTabHeight'
          inlineIndent = "8"
        >
          {rootSubmenuKeysElements}
        </Menu>
      </Spin>);
  }
}
