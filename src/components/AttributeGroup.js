import React from 'react'
import PropTypes from 'prop-types'
import { Menu, Tooltip, Button, Popover, Col } from 'antd'

export class AttributeGroup extends React.Component
{
  propTypes = {
    attributes:         PropTypes.array.isRequired,
    onToggleAttribute:  PropTypes.func.isRequired,
    onToggleAll:        PropTypes.func.isRequired
  }

  width = 0;
  titleWidth = 0;
  titleLength = 0;
  
  constructor(props)
  {
    console.log("AttributeGroup.constructor[props]:", props);
    super(props);
    this.state = this.getState_(props.attributes);
    this.width        = ((props.width) ? props.width : 100);
    this.titleWidth   = this.width - 41;
    this.titleLength  = Math.floor(this.titleWidth / 9);
    console.log("AttributeGroup.constructor[state]:", this.state);
  }

  getState_(items = [])
  {
    let selectedKeys = [];
    items.map( item => {
      if(item.selected == true)
      {
        selectedKeys.push(item.id + '');
      }
    });

    return {
      checkedAll: selectedKeys.length === items.length && items.length > 0,
      selectedKeys: selectedKeys
    }
  }

  componentWillReceiveProps(nextProps) {
    console.log("AttributeGroup.componentWillReceiveProps[nextProps]", nextProps);
    console.log("AttributeGroup.componentWillReceiveProps[currProps]", this.props);
    console.log("AttributeGroup.componentWillReceiveProps[currState]", this.state);
    this.setState(this.getState_(nextProps.attributes));
    console.log("AttributeGroup.componentWillReceiveProps[nextState]", this.state);
  }

  getMenuItem(item)
  {
    if(item.title.length > this.titleLength)
    {
      return(
        <Menu.Item key={item.id} style={{margin: 0, padding: 0}}>
          <Tooltip mouseLeaveDelay={0} title={item.title}>
            <span style={{marginLeft: -24}}>{item.title}</span>
          </Tooltip>
        </Menu.Item>);
    }

    return (
      <Menu.Item key={item.id} style={{margin: 0, padding: 0}}>
        <span style={{marginLeft: -24}}>{item.title}</span>
      </Menu.Item>);
  }

  render()
  {
    console.log("AttributeGroup.render[props]:", this.props);
    console.log("AttributeGroup.render[state]:", this.state);
    if(this.props.attributes && this.props.attributes.length > 0)
    {
      return(
        <div  className = 'searchPanelTabHeight' 
              span = {8}
              style={{marginLeft: 8, marginTop: 8, width: 100, float: 'left'}}>
          <Popover  content={this.state.checkedAll ? "Снять выделение со всех атрибутов" : "Выделить все атрибуты"} 
                    title={this.props.attributes[0].group_title}>
            <Button type={this.state.checkedAll ? 'primary' : 'default'} 
                    size="small" 
                    onClick={ event => { this.props.onToggleAll(this.props.attributes[0].group_id, !this.state.checkedAll); }} 
                    style={{width: "100%"}}>
              {this.props.attributes[0].group_title}
            </Button>
          </Popover>

          <div  style={{marginTop: 8}}
                className = 'searchPanelTabAttributesListHeight scrollable-y'>
            <Menu
              mode="inline"
              selectedKeys={this.state.selectedKeys}
              multiple = {true}
              onSelect={(item, key, selectedKeys) => { this.props.onToggleAttribute(parseInt(item.key)); }}
              onDeselect={(item, key, selectedKeys) => { this.props.onToggleAttribute(parseInt(item.key)); }}
              style={{ margin: 0 }}
            >
              {
                this.props.attributes.map(item => (
                  this.getMenuItem(item)
                ))
              }
            </Menu>
          </div>
        </div>
      );
    }
    return(<div />);
  }
}
