import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import {Row, Col} from 'antd';

import SearchContainer from './search/main';

class Form extends Component {
  static propTypes = {
    search:     PropTypes.object.isRequired,
    positions:  PropTypes.object.isRequired,
    header:     PropTypes.object.isRequired,
    dispatch:   PropTypes.func.isRequired,
  }

  render()
  {
    console.log("Form.Render[props]:", this.props);
    return(
      <div style={{height: "100vh"}}>
        <SearchContainer isSearching  = { this.props.search.isSearching }
                         criterias    = { this.props.search.criterias }
                         results      = { this.props.search.results }
                         dispatch     = { this.props.dispatch } />
        <div>
          <div style={{minHeight: "calc(100vh - 420px)", backgroundColor: "#DBBDFF", clear: "both"}}>
            Position Table
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
  const { search, positions, header } = state;
  return {
    search:     search,
    positions:  positions,
    header:     header,
  }
}

export default connect(mapStateToProps)(Form)
