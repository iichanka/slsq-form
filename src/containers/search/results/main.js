import React                          from 'react';
import { Tabs }                       from 'antd';
import PropTypes                      from 'prop-types'
import { selectResultTab } from '../actions/search/results/main';

const { TabPane } = Tabs;

export default class ResultsTabs extends React.Component {
  static PropTypes = {
    isSearching:      PropTypes.bool.isRequired,
    selectedTab:      PropTypes.string.isRequired,
    results:          PropTypes.object.isRequired,
  }

  onTabSelect(key)
  {
    this.props.dispatch(selectResultTab(key));
  }

  render() {
    console.log("ResultsTabs.Render[props]:", this.props);
    return(
      <Tabs defaultActiveKey = { this.props.selectedTab }
            size = 'small'
            onChange = { key => this.onTabSelect(key)}>
        <TabPane  tab = 'Остатки'
                  key = '1'
                  className = 'searchPanelTabs'>
          111
        </TabPane>

        <TabPane  tab = 'В пути' 
                  key = '2' 
                  className = 'searchPanelTabs'>
          Content of tab 2
        </TabPane>
        
        <TabPane  tab = 'Материалы' 
                  key = '3' 
                  className = 'searchPanelTabs'>
          Content of tab 3
        </TabPane>
      </Tabs>
    );
  };
}