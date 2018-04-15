import React                          from 'react';
import PropTypes                      from 'prop-types'




export default class ResultsTable extends React.Component {
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