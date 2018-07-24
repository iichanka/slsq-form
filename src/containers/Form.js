import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { receiveEditableStatus } from '../actions/isEditable';

import { load as loadConfigs }                      from '../actions/configs/main';
import { getEditableStatus as loadStatus }          from '../actions/isEditable';
import SearchContainer                              from './search/main';
import { PositionsContainer }                       from './positions';
import { SearchResultList } from '../components';

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
          
        <div style={{maxHeight: "10px"}}>
          {/* SearchHelpTst */}
          <SearchResultList
            data = {[{
              key: '1',
              name: 'John Brown',
              age: 32,
              address: 'New York No. 1 Lake Park',
            }, {
              key: '2',
              name: 'Jim Green',
              age: 42,
              address: 'London No. 1 Lake Park',
            }, {
              key: '3',
              name: 'Joe Black',
              age: 32,
              address: 'Sidney No. 1 Lake Park',
            }, {
              key: '4',
              name: 'Disabled User',
              age: 99,
              address: 'Sidney No. 1 Lake Park',
            }]}
            columns = {[{
              title: 'Name',
              dataIndex: 'name',
              width: '900px',
            }, {
              title: 'Age',
              dataIndex: 'age',
            }, {
              title: 'Address',
              dataIndex: 'address',
            }]}
            onSelect = { (rec) => { console.log(rec) } }
          />
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
