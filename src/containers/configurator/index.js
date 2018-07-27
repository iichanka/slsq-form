import React                                                from 'react';
import { Modal, Tabs, Spin }                                from 'antd';
import PropTypes                                            from 'prop-types';
import Configurator                                         from './configurator';
import { updateConfigs }                                    from '../../actions/configs/main';

import { toggleConfiguratorVisible }                        from '../../actions/configs/main'

const { TabPane } = Tabs;



export class ConfiguratorPanel extends React.Component {
  static propTypes = {
    visible:        PropTypes.bool.isRequired,
    configs:        PropTypes.array.isRequired,
    isProcessing:   PropTypes.bool.isRequired,
    dispatch:       PropTypes.func.isRequired,
  }

  constructor(props)
  {
    super(props);
    this.state = this.getStateFromProps(props);
  }
  
  componentWillReceiveProps(newProps)
  {
    this.setState(this.getStateFromProps(newProps));
  }

  getStateFromProps = (props) => {
    console.log('containers.configurator.panel.getStateFromProps[props]', props);
    const { configs, visible } = props;

    let allFields = [];
    let visibleFields = [];
    let pageSize = [];

    if(configs)
    {
      configs.map( config => {
        allFields[config.type] = config.columns;
        visibleFields[config.type] = config.columns.map( column => {
          return column.visible && !column.technical ? column.key : null;
        }).filter( column => !!column );
        pageSize[config.type] = config.pageSize;
      })
    }

    let newState = { 
      visible: visible,
      selectedKeys: [],
      allFields: allFields,
      visibleFields: visibleFields,
      pageSize: pageSize,
    }

    return newState;
  }

  onTargetKayesChange = (type, targetKeys = []) => {
    let { visibleFields, allFields }   = this.state;
    let orderIndex      = 0;

    console.log('containers.configurator.panel.onTargetKayesChange[visibleFields, allFields, targetKeys]', visibleFields, allFields, targetKeys);

    //получаем список добавленных полей
    if( targetKeys.length > visibleFields[type].length )
    {
      let newKeys = targetKeys.map( key => {
        if(visibleFields[type].indexOf(key) === -1)
        {
          return key;
        }
        return null;
      }).filter( key => !!key );

      //добавляем их в конец
      if(newKeys.length > 0)
      {
        for(let i = 0; i < newKeys.length; i++)
        {
          visibleFields[type].push(newKeys[i]);
        }
      }
    }
    else
    {
      visibleFields[type] = targetKeys;
    }

    //скрываем все елементы
    allFields[type] = allFields[type].map( field => {
      field.visible     = false;
      field.orderIndex  = -1;
      return field;
    });

    //выбираем какие поля показывать и присваиваем им новые индексы
    visibleFields[type].map( key => {
      for(let i = 0; i < allFields[type].length; i++)
      { 
        if(allFields[type][i].key === key)
        {
          allFields[type][i].orderIndex = orderIndex;
          allFields[type][i].visible    = true;
          break;
        }       
      }
      orderIndex++;
    });

    allFields[type].sort( (a, b) => a.orderIndex - b.orderIndex );
    this.setState({ visibleFields, allFields });
  }

  onPageSizeChange = (type, newValue) => {
    let pageSize = this.state.pageSize;
    pageSize[type] = newValue;
    this.setState({ pageSize });
  }

  onClose = (event) => {
    const { dispatch } = this.props;

    if(this.props.isProcessing)
    {
      return;
    }

    this.setState(this.getStateFromProps(this.props));
    dispatch(toggleConfiguratorVisible());
  }

  clearConfigFields = ( fields = [] ) => {
    return fields.map( field => {
      let clearField = {};
      clearField.title      = field.title;
      clearField.dataIndex  = field.dataIndex;
      clearField.dataType   = field.dataType;
      clearField.width      = field.width;
      clearField.sortable   = field.sortable;
      clearField.searchable = field.searchable;
      clearField.visible    = field.visible;
      clearField.editable   = field.editable;
      clearField.fixed      = field.fixed;
      clearField.orderIndex = field.orderIndex;
      clearField.technical  = field.technical;
      return clearField;
    });
  }

  onSave = (event) => {
    const { toggleVisible, dispatch } = this.props;

    let newConfigs = [];

    for(let type in this.state.allFields)
    {
      console.log('containers.configurator.index.onSave(type)', type);
      newConfigs.push({
        type,
        columns: this.clearConfigFields(this.state.allFields[type]),
        pageSize: this.state.pageSize[type],
      })
    }

    dispatch(updateConfigs(newConfigs));
  }


  render() {
    console.log('containers.configurator.index.render()[state]', this.state);

    return (
      <Modal
          title           = "Конфигуратор"
          visible         = { this.props.visible }
          onOk            = { this.onSave }
          onCancel        = { this.onClose }
          confirmLoading  = { this.props.isProcessing }
          okText          = 'Сохранить'
          bodyStyle       = {{ width: 700, height: 405 }}
          style           = {{ minWidth: 700 }}
        >
          <Spin spinning = { this.props.isProcessing }>
            <Tabs
              defaultActiveKey = "REMNANTS"
              tabPosition      = 'left'
              style            = {{ height: 405 }}
              tabBarStyle      = {{ textAlign: "left !important" }}
            >
              <TabPane 
                tab   = 'Остатки'
                key   = 'REMNANTS'
                style = {{ marginLeft: -7, marginTop: 7 }}
                >
                <Configurator allFields             = { this.state.allFields['REMNANTS'] }
                              visibleFields         = { this.state.visibleFields['REMNANTS'] }
                              pageSize              = { this.state.pageSize['REMNANTS'] }
                              onTargetKeysChange    = { (targetKeys) => { this.onTargetKayesChange('REMNANTS', targetKeys) } } 
                              onPageSizeChange      = { (newValue) => { this.onPageSizeChange('REMNANTS', newValue) } }
                               />
              </TabPane>
              
              <TabPane 
                tab   = "В пути"
                key   = "RFIT"
                style = {{ marginLeft: -7, marginTop: 7 }}
                >
                <Configurator allFields             = { this.state.allFields['IN_TRANSIT'] }
                              visibleFields         = { this.state.visibleFields['IN_TRANSIT'] }
                              pageSize              = { this.state.pageSize['IN_TRANSIT'] }
                              onTargetKeysChange    = { (targetKeys) => { this.onTargetKayesChange('IN_TRANSIT', targetKeys) } }
                              onPageSizeChange      = { (newValue) => { this.onPageSizeChange('IN_TRANSIT', newValue) } } />
              </TabPane>
              
              <TabPane 
                tab="Материалы" 
                key="FRM"
                style = {{ marginLeft: -7, marginTop: 7 }}
                >
                <Configurator allFields             = { this.state.allFields['MATERIALS'] }
                              visibleFields         = { this.state.visibleFields['MATERIALS'] }
                              pageSize              = { this.state.pageSize['MATERIALS'] }
                              onTargetKeysChange    = { (targetKeys) => { this.onTargetKayesChange('MATERIALS', targetKeys) } }
                              onPageSizeChange      = { (newValue) => { this.onPageSizeChange('MATERIALS', newValue) } } />
              </TabPane>
              
              <TabPane
                tab="Позиции"
                key="POS"
                style = {{ marginLeft: -7, marginTop: 7 }}
                >
                <Configurator allFields             = { this.state.allFields['POSITIONS'] }
                              visibleFields         = { this.state.visibleFields['POSITIONS'] }
                              pageSize              = { this.state.pageSize['POSITIONS'] }
                              onTargetKeysChange    = { (targetKeys) => { this.onTargetKayesChange('POSITIONS', targetKeys); } }
                              onPageSizeChange      = { (newValue) => { this.onPageSizeChange('POSITIONS', newValue); } } />
              </TabPane>
            </Tabs>
          </Spin>
        </Modal>
    );
  }
}