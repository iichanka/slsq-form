import React, { Component }                         from 'react';
import PropTypes                                    from 'prop-types';
import {Row, Col, Tabs, Alert, Button, Icon }       from 'antd';
import ClassificatorLayout                          from './criterias/classificator/layout';
import SearchButtonBox                              from './criterias/searchButtonBox';
import { selectTab as selectCTab }                  from '../../actions/search/criterias/main';
import { selectTab as selectRTab }                  from '../../actions/search/results/main';
import ConfigurableTable                            from '../configurableTable';
import { ConfiguratorPanel }                        from '../configurator';

const { TabPane } = Tabs;

export default class SearchContainer extends Component {
  static propTypes = {
    isSearching:  PropTypes.bool.isRequired,
    configs:      PropTypes.object.isRequired,
    criterias:    PropTypes.object.isRequired,
    results:      PropTypes.object.isRequired,
    isEditable:   PropTypes.bool.isRequired,
    dispatch:     PropTypes.func.isRequired,    
  }

  constructor(props)
  {
    super(props);
    this.rfrConfig = {
      type: 'RFR',
      columns: [],
    };
    this.saveConfigs(props.configs);
    this.state = { configuratorVisible: false };
  }

  onTabSelect(key, type)
  {
    const { dispatch } = this.props;
    switch(type)
    {
      case 'C':
      {
        dispatch(selectCTab(key));
        break;
      }
      case 'R':
      {
        dispatch(selectRTab(key));
        break;
      }
    }
  }

  saveConfigs(configs)
  {
    configs.tableConfigs.map(config => {
      switch(config.type)
      {
        case 'RFR':
        {
          this.rfrConfig = config;
        }
      }
    })
  }


  componentWillReceiveProps(newProps)
  {
    this.saveConfigs(newProps.configs);
  }

  onConfigEdit(activeTab)
  {
    this.setState({configuratorVisible: !this.state.configuratorVisible});
  }

  getConfigEditButton(activeTab)
  {
    return(
      <Button type    = 'primary' 
              icon    = 'setting' 
              onClick = { event => { this.toggleConfiguratorVisible(); } }
              style   = {{ top: -2 }}/>
    );
  }

  toggleConfiguratorVisible = (event) => {
    this.setState({configuratorVisible: !this.state.configuratorVisible});
  }


  render()
  {
    console.log("containers.search.main.render[props]:", this.props);
    return(
      <div>
        <Row>
          <Col className  = 'searchContainer' 
               span       = { 8 } >
            <div className = 'searchCriteriasBox'>
              <Tabs defaultActiveKey = 'SBC'
                    size             = 'small'
                    onChange         = { key => this.onTabSelect(key, 'C') } >

                <TabPane  tab       = 'Класс'
                          key       = 'SBC'
                          className = 'searchPanelTabs'>
                  
                  <ClassificatorLayout isLoading      = { this.props.criterias.classificator.isLoading }
                                       items          = { this.props.criterias.classificator.items }
                                       selectedClass  = { this.props.criterias.classificator.selectedClassItemID }
                                       dispatch       = { this.props.dispatch } />

                </TabPane>

                <TabPane tab        = 'Иерархия'
                         key        = 'SBH' 
                         className  = 'searchPanelTabs' >

                  <Alert message  = 'В разработке'
                         type     = 'info'
                         style    = {{ margin: 8 }} />

                </TabPane>

                <TabPane tab        = 'Материал' 
                         key        = 'SBM' 
                         className  = 'searchPanelTabs' >
                         
                  <Alert message  = 'В разработке'
                         type     = 'info'
                         style    = {{ margin: 8 }} />

                </TabPane>
              </Tabs>              
            </div>

            <div className = 'searchCriteriasButtonBox'>
              <SearchButtonBox isSearching  = { this.props.isSearching }
                               criterias    = { this.props.criterias }
                               dispatch     = { this.props.dispatch } />
            </div>
          </Col>
          <Col className  = 'searchContainer'
               span       = { 16 } >
            <Tabs defaultActiveKey    = { this.props.results.activeTab }
                  size                = 'small'
                  onChange            = { key => this.onTabSelect(key, 'R') }
                  tabBarExtraContent  = { this.getConfigEditButton(this.props.results.activeTab) } >

              <TabPane  tab       = 'Остатки'
                        key       = 'RFR'
                        className = 'searchPanelTabsFull'>
                
                <ConfigurableTable isProcessing = { this.props.isSearching }
                                   config       = { this.rfrConfig }
                                   data         = { this.props.results.remnants }
                                   isEditable   = { this.props.isEditable }
                                   dispatch     = { this.props.dispatch } />

              </TabPane>

              <TabPane tab        = 'В пути'
                       key        = 'RFIT' 
                       className  = 'searchPanelTabsFull' >

                <Alert message  = 'В разработке'
                       type     = 'info'
                       style    = {{ margin: 8 }} />

              </TabPane>

              <TabPane tab        = 'Материалы' 
                       key        = 'RFM' 
                       className  = 'searchPanelTabsFull' >
                        
                <Alert message  = 'В разработке'
                       type     = 'info'
                       style    = {{ margin: 8 }} />

              </TabPane>
            </Tabs>
          </Col>
        </Row>
        <ConfiguratorPanel 
          visible       = { this.state.configuratorVisible }
          configs       = { this.props.configs.tableConfigs }
          isProcessing  = { this.props.configs.isLoading }
          dispatch      = { this.props.dispatch }
          toggleVisible = { this.toggleConfiguratorVisible.bind(this) }
        />
      </div>);
  }
}
