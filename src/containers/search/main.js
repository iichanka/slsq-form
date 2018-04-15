import React, { Component }                         from 'react';
import PropTypes                                    from 'prop-types';
import {Row, Col, Tabs, Alert, Button }             from 'antd';
import ClassificatorLayout                          from './criterias/classificator/layout';
import SearchButtonBox                              from './criterias/searchButtonBox';
import { selectTab as selectCTab }                  from '../../actions/search/criterias/main';
import { selectTab as selectRTab }                  from '../../actions/search/results/main';
import { load as loadConfigs }                      from '../../actions/configs/main';

const { TabPane } = Tabs;

export default class SearchContainer extends Component {
  static propTypes = {
    isSearching:  PropTypes.bool.isRequired,
    criterias:    PropTypes.object.isRequired,
    results:      PropTypes.object.isRequired,
    dispatch:     PropTypes.func.isRequired,    
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

  componentWillMount()
  {
    const { dispatch } = this.props;
    dispatch(loadConfigs());
  }

  onConfigEdit(activeTab)
  {

  }

  getConfigEditButton(activeTab)
  {
    return(
      <Button type    = 'primary' 
              icon    = 'setting' 
              onClick = { event => { this.onConfigEdit(activeTab) } }
              style   = {{ top: -2 }}/>
    );
  }

  render()
  {
    console.log("containers.search.main.render[props]:", this.props);
    return(
        <Row>
          <Col className  = 'searchContainer' 
               span       = { 8 } >
            <div className = 'searchCriteriasBox'>
              <Tabs defaultActiveKey = { this.props.criterias.activeTab }
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
                        className = 'searchPanelTabs'>

              </TabPane>

              <TabPane tab        = 'В пути'
                       key        = 'RFIT' 
                       className  = 'searchPanelTabs' >

                <Alert message  = 'В разработке'
                       type     = 'info'
                       style    = {{ margin: 8 }} />

              </TabPane>

              <TabPane tab        = 'Материалы' 
                       key        = 'RFM' 
                       className  = 'searchPanelTabs' >
                        
                <Alert message  = 'В разработке'
                       type     = 'info'
                       style    = {{ margin: 8 }} />

              </TabPane>
            </Tabs>
          </Col>
        </Row>);
  }
}
