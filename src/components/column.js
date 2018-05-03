import React                            from 'react';
import PropTypes                        from 'prop-types';
import { Input, Icon, Button, Popover, Row, Col } from 'antd'

const initialState = {
  filterText: '',
  sort: '',
  dropdownVisible: false,
  filtered: false,
  sorted: false,
};

export default class Column extends React.Component
{
  /* static PropTypes = {
    forceUpdateCallback:    PropTypes.func.isRequired,
  } */


  setData(data)
  {
    this.state = initialState;
    this.fillAttributes(data);
  }

  setCallbacks(onFilterCallback, onSortCallback)
  {
    this.onFilterCallback = onFilterCallback;
    this.onSortCallback = onSortCallback;
  }

  setUpdateFunc(forceUpdateCallback)
  {
    this.forceUpdateF = forceUpdateCallback;
  }

  buildDropdown(column)
  {
    return(
      <div className="custom-filter-dropdown">
        <Row>
          <Col span = { 24 }>
            <Button style = {{ width: '100%' }}
                    size = 'small'
                    icon = 'arrow-down'>
              Сортировать от А до Я
            </Button>
          </Col>
        </Row>
        <Row>
          <Col span = { 24 } >
            <Button style = {{ width: '100%' }}
                    size = 'small'
                    icon = 'arrow-up'>
              Сортировать от Я до А
            </Button>
          </Col>
        </Row>
        <Input
          ref={ele => this.searchInput = ele}
          placeholder="Search name"
          /* value={this.state.filterText}
          onChange={this.onInputChange}
          onPressEnter={ () => {}} */
        />
        <Button type="primary" /* onClick={ () => this.props.filterCallback(this.state.filterText)} */>Search</Button>
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
      this.className                      = 'table-actions-without-padding';
      this.onFilterDropdownVisibleChange  = (visible) => {
        console.log('components.column.onFilterDropdownVisible()[visible]:', visible);
        this.filterDropdownVisible = visible;
        this.forceUpdateF();
        this.forceUpdate();
      }
      this.width                          = (column.width !== undefined && column.width !== "") ? column.width : undefined;
      this.visible                        = column.visible;
      this.searchable                     = column.searchable;
      this.sortable                       = column.sortable;
    }   
  }

  onInputChange = (e) => {
    this.setState({ filterText: e.target.value });
  }

  componentWillReceiveProps(newProps)
  {
    this.fillAttributes(newProps.column);
  }

  render() { 
    console.log('components.column.render()');
    this.filterDropdownVisible = this.state.dropdownVisible;
    return false; 
 }
}
