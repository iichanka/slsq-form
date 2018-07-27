import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { receiveEditableStatus } from '../actions/isEditable';

import { load as loadConfigs }                      from '../actions/configs/main';
import { getEditableStatus as loadStatus }          from '../actions/isEditable';
import SearchContainer                              from './search/main';
import { PositionsContainer }                       from './positions';
import { SearchResultList }                         from '../components';
import { SearchHelp } from '../components/SearchHelp';
import { PTable } from '../components/PositionsTable/PTable';
import { PositionsTable } from '../components/PositionsTable/PositionsTable';

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
    
    window.setEditableStatus = (status) =>
    {
      dispatch(receiveEditableStatus(status));
    }

    document.setEditableStatus = (status) =>
    {
      dispatch(receiveEditableStatus(status));
    }
  }

  constructor(props)
  {
    super(props);
    this.state = {visible: true};
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
          
        <PositionsContainer configs     = { this.props.configs }   
                            positions   = { this.props.positions }
                            dispatch    = { this.props.dispatch }
                            isEditable  = { this.props.isEditable }
                            dispatch    = { this.props.dispatch } />
          
        <div>
          {/* <input id="sh5" svhtype="backgroundSearch" autocomplete="off" onClick = { (evt) => { window.parent.F4Help(evt, 'COM_PR_IND_OBJECT_SHTEXT', document.getElementById('sh5')); } }/> */}
          
          
        </div>

        {/* SearchHelpTst */}
        
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
