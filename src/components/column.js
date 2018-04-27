import React from 'react'
import PropTypes from 'prop-types'
import { Input, Icon, Button, Popover, Col } from 'antd'

const initialState = {
  filterText: '',
  sort: '',
  dropdownVisible: false,
  filtered: false,
  sorted: false,
};

export default class Column extends React.Component
{
  propTypes = {
    column:             PropTypes.object.isRequired,
    filterCallback:     PropTypes.func.isRequired,
    sortCallback:       PropTypes.func.isRequired,
  }

  buildDropdown(column)
  {
    return(
      <div className="custom-filter-dropdown">
          <Input
            ref={ele => this.searchInput = ele}
            placeholder="Search name"
            value={this.state.filterText}
            onChange={this.onInputChange}
            onPressEnter={ () => this.props.filterCallback(this.state.filterText)}
          />
          <Button type="primary" onClick={ () => this.props.filterCallback(this.state.filterText)}>Search</Button>
        </div>
    );
  }

  fillAttributes = (column) => {
    if(column.visible)
    {
      this.filterIcon = ( column.searchable || column.sortable ) && 
      <Icon type  = "filter" 
            style = {{ color: (this.state.filtered || this.state.sorted) ? '#108ee9' : '#aaa' }} />;

      this.title                          = column.title;
      this.dataIndex                      = column.dataIndex;
      this.key                            = column.key;
      this.filterDropdown                 = this.buildDropdown(column);
      this.filterDropdownVisible          = this.state.dropdownVisible;
      this.onFilterDropdownVisibleChange  = (visible) => {
        this.setState({
          dropdownVisible: visible,
        }, 
        () => this.searchInput && this.searchInput.focus());
      }
    }   
  }

  constructor(props)
  {
    console.log("components.columns.constructor[props]:", props);
    super(props);
    this.state = initialState;
    this.fillAttributes(props.column);
  }

  onInputChange = (e) => {
    this.setState({ filterText: e.target.value });
  }

  

  


  componentWillReceiveProps(newProps)
  {
    this.fillAttributes(newProps.column);
  }

  render() { 
    return false; 
 }
}
