import React, { Component }                         from 'react';
import PropTypes                                    from 'prop-types';
import {Row, Col, Tabs, Alert, Button, Icon, 
        Input }                                     from 'antd';
import ClassificatorLayout                          from './criterias/classificator/layout';
import SearchButtonBox                              from './criterias/searchButtonBox';
import { selectTab as selectCTab }                  from '../../actions/search/criterias/main';
import { selectTab as selectRTab }                  from '../../actions/search/results/main';
import ConfigurableTable                            from '../configurableTable';
import { ConfiguratorPanel }                        from '../configurator';
import { clone }                                    from '../../utils';
import { addPositionItem }                          from '../../actions/positions/addPosition';
import { TableCell, ConfigEditorButtons }           from '../../components';


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

  onAddClick(record)
  {
    const { dispatch } = this.props;   

    if(record.countInputReference)
    {
      record.countInputReference.input.blur();
      switch(record.itemType)
      {
        case 'RFR':
        {
          dispatch(addPositionItem({ remnants: {...record, count: record.countInputReference.input.value } }));
        }
      }
    }
  }

  addActions(config, data, isEditable, columns = [])
  {
    if(columns.length === 0 || !isEditable)
    {
      return;
    }

    switch(config.type)
    {
      case 'RFR':
      case 'RFIT':
      case 'RFM':
      {
        columns.unshift({
          key:    'actions',
          title:  'Действия',
          width:  100,
          className: 'table-actions-without-padding',
          render: (text, record) => { 
            return(
              <TableCell action = { true } >
                <Input  
                  size = "small" 
                  placeholder = "1,000"
                  defaultValue = '1,000'
                  ref = { (ref) => { record.countInputReference = ref; } }
                  style = {{ width: 100 }}
                  addonAfter = { <Icon type = "plus-circle-o" onClick = { (e) => { this.onAddClick(record) } } />}
                  onPressEnter = { (e) => { this.onAddClick(record) } } />
              </TableCell>
            );
          },
        });
        break;
      }
    }
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
                  tabBarExtraContent  = { <ConfigEditorButtons 
                                            isPersonalizationActive = { this.props.configs.isPersonalizationActive }
                                            isConfiguratorVisible   = { this.props.configs.isConfiguratorVisible }
                                            dispatch                = { this.props.dispatch } /> } >

              <TabPane  tab       = 'Остатки'
                        key       = 'RFR'
                        className = 'searchPanelTabsFull'>
                
                <ConfigurableTable isProcessing       = { this.props.isSearching }
                                   config             = { this.rfrConfig }
                                   data               = { this.props.results.remnants.map( r => { r.itemType = 'RFR'; return r; }) }
                                   isEditable         = { this.props.isEditable }
                                   dispatch           = { this.props.dispatch }
                                   modifyColumns      = { this.addActions.bind(this) } 
                                   onAddClick         = { this.onAddClick.bind(this) }
                                   scrollHeight       = { 217 } />

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
          visible       = { this.props.configs.isConfiguratorVisible }
          configs       = { this.props.configs.tableConfigs }
          isProcessing  = { this.props.configs.isLoading }
          dispatch      = { this.props.dispatch }
        />
      </div>);
  }
}
