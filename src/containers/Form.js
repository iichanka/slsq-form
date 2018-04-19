import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import {Row, Col, Card, Button } from 'antd';

import { load as loadConfigs }                      from '../actions/configs/main';
import { getEditableStatus as loadStatus }          from '../actions/isEditable';
import SearchContainer from './search/main';

class Form extends Component {
  static propTypes = {
    configs:    PropTypes.object.isRequired,
    search:     PropTypes.object.isRequired,
    positions:  PropTypes.object.isRequired,
    header:     PropTypes.object.isRequired,
    isEditable: PropTypes.bool.isRequired,
    dispatch:   PropTypes.func.isRequired,
  }

  componentWillMount()
  {
    const { dispatch } = this.props;
    dispatch(loadConfigs());
    dispatch(loadStatus());
  }

  getConfigEditButton()
  {
    return(
      <Button type    = 'primary' 
              icon    = 'setting' 
              onClick = { event => { this.onConfigEdit() } }
              style   = {{ }}/>
    );
  }

  onConfigEdit = () => {

  }


  render()
  {
    console.log("Form.Render[props]:", this.props);
    return(
      <div style={{height: "100vh"}}>
        <SearchContainer isSearching  = { this.props.search.isSearching }
                         configs      = { this.props.configs }
                         criterias    = { this.props.search.criterias }
                         results      = { this.props.search.results }
                         dispatch     = { this.props.dispatch }
                         isEditable   = { this.props.isEditable } />
        <div>
          <div style={{}}>
          <Card title     = "Позиции" 
                bordered  = { false }
                style     = {{ minHeight: "calc(100vh - 420px)", clear: "both"}}
                extra     = { this.getConfigEditButton() }>
            <p>Card content</p>
            <p>Card content</p>
            <p>Card content</p>
          </Card>
          </div>
          <div style={{minHeight: "35px", backgroundColor: "#AABBFF"}}>
            Recalc Button
          </div>
      </div>
        <div style={{minHeight: "35px", backgroundColor: "#AADBFF"}}>
          Quotation Header
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  console.log("mapStateToProps:", state);
  const { search, positions, header, configs, isEditable } = state;
  return {
    search:     search,
    positions:  positions,
    header:     header,
    configs:    configs,
    isEditable: isEditable,
  }
}

export default connect(mapStateToProps)(Form)
