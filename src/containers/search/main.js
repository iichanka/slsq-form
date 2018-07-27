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

import { HierarchyMenu }                            from './criterias/hierarchy';


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
    this.remnantsConfig = {
      type: 'REMNANTS',
      columns: [],
    };

    this.inTransintConfig = {
      type: 'IN_TRANSIT',
      columns: [],
    };

    this.materialsConfig = {
      type: 'MATERIALS',
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
        case 'REMNANTS':
        {
          this.remnantsConfig = config;
          break;
        }
        case 'IN_TRANSIT':
        {
          this.inTransintConfig = config;
          break;
        }
        case 'MATERIALS':
        {
          this.materialsConfig = config;
          break;
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
        case 'REMNANTS':
        {
          dispatch(addPositionItem({ remnants: {...record, count: record.countInputReference.input.value } }));
          break;
        }
        case 'IN_TRANSIT':
        {
          dispatch(addPositionItem({ inTransit: {...record, count: record.countInputReference.input.value } }));
          break;
        }
        case 'MATERIALS':
        {
          dispatch(addPositionItem({ materilas: {...record, count: record.countInputReference.input.value } }));
          break;
        }
      }
    }
  }

  addActions(config, isEditable, columns = [])
  {
    if(columns.length === 0 || !isEditable)
    {
      return;
    }

    switch(config.type)
    {
      case 'REMNANTS':
      case 'IN_TRANSIT':
      case 'MATERIALS':
      {
        columns.unshift({
          key:    'actions',
          title:  'Действия',
          width:  200,
          className: 'table-actions-without-padding',
          onHeaderCell: (cell) => {
            return {
              width: 200,
              title: 'Действия',
            }
          },
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

                  <HierarchyMenu
                    isLoading         = { this.props.criterias.hierarchy.isLoading }
                    items             = { this.props.criterias.hierarchy.items }
                    dispatch          = { this.props.dispatch } />

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
                        key       = 'REMNANTS'
                        className = 'searchPanelTabsFull'>
                
                <ConfigurableTable isProcessing             = { this.props.isSearching }
                                   config                   = { this.remnantsConfig }
                                   data                     = { this.props.results.remnants.map( r => r ) }
                                   isEditable               = { this.props.isEditable }
                                   isPersonalizationActive  = { this.props.configs.isPersonalizationActive }
                                   dispatch                 = { this.props.dispatch }
                                   modifyColumns            = { this.addActions.bind(this) } 
                                   onAddClick               = { this.onAddClick.bind(this) }
                                   scrollHeight             = { 237 } />

              </TabPane>

              <TabPane tab        = 'В пути'
                       key        = 'IN_TRANSIT' 
                       className  = 'searchPanelTabsFull' >

                <ConfigurableTable isProcessing             = { this.props.isSearching }
                                   config                   = { this.inTransintConfig }
                                   data                     = { this.props.results.inTransit.map( r => r ) }
                                   isEditable               = { this.props.isEditable }
                                   isPersonalizationActive  = { this.props.configs.isPersonalizationActive }
                                   dispatch                 = { this.props.dispatch }
                                   modifyColumns            = { this.addActions.bind(this) } 
                                   onAddClick               = { this.onAddClick.bind(this) }
                                   scrollHeight             = { 237 } />

              </TabPane>

              <TabPane tab        = 'Материалы' 
                       key        = 'MATERIALS' 
                       className  = 'searchPanelTabsFull' >
                        
                <ConfigurableTable  isProcessing             = { this.props.isSearching }
                                    config                   = { this.materialsConfig }
                                    data                     = { this.props.results.materials.map( r => r ) }
                                    isEditable               = { this.props.isEditable }
                                    isPersonalizationActive  = { this.props.configs.isPersonalizationActive }
                                    dispatch                 = { this.props.dispatch }
                                    modifyColumns            = { this.addActions.bind(this) } 
                                    onAddClick               = { this.onAddClick.bind(this) }
                                    scrollHeight             = { 237 } />

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
