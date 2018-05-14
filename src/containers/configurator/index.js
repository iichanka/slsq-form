import React                                                from 'react';
import { Modal, Tabs, Spin }                                from 'antd';
import PropTypes                                            from 'prop-types';
import Configurator                                         from './configurator';
import { updateConfigs }                                    from '../../actions/configs/main';

const { TabPane } = Tabs;

export class ConfiguratorPanel extends React.Component {
  static propTypes = {
    visible:        PropTypes.bool.isRequired,
    configs:        PropTypes.array.isRequired,
    isProcessing:   PropTypes.bool.isRequired,
    dispatch:       PropTypes.func.isRequired,
    toggleVisible:  PropTypes.func.isRequired,
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

    console.log('containers.configurator.panel.getStateFromProps[newState]', newState);
    return newState;
  }

  onTargetKayesChange = (type, targetKeys) => {
    let visibleFields     = this.state.visibleFields;
    let allFields         = this.state.allFields;
    let orderIndex        = 0;

    targetKeys.map( key => {
      for(let i = 0; i < allFields[type].length; i++)
      {
        if(targetKeys.indexOf(allFields[type][i].key) === -1)
        {
          allFields[type][i].visible = false;
        }
        
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
    
    visibleFields[type] = targetKeys;
    this.setState({ visibleFields, allFields });
  }

  onPageSizeChange = (type, newValue) => {
    let pageSize = this.state.pageSize;
    pageSize[type] = newValue;
    this.setState({ pageSize });
  }

  onClose = (event) => {
    const { toggleVisible } = this.props;
    this.setState(this.getStateFromProps(this.props));
    toggleVisible();
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
    
    newConfigs.push(
      {
        type: 'RFR',
        columns: this.clearConfigFields(this.state.allFields['RFR']),
        pageSize: this.state.pageSize['RFR'],
      }
    );

    newConfigs.push(
      {
        type: 'RFIT',
        columns: this.clearConfigFields(this.state.allFields['RFIT']),
        pageSize: this.state.pageSize['RFIT'],
      }
    );

    newConfigs.push(
      {
        type: 'RFM',
        columns: this.clearConfigFields(this.state.allFields['RFM']),
        pageSize: this.state.pageSize['RFM'],
      }
    );

    newConfigs.push(
      {
        type: 'POS',
        columns: this.clearConfigFields(this.state.allFields['POS']),
        pageSize: this.state.pageSize['POS'],
      }
    );

    dispatch(updateConfigs(newConfigs, toggleVisible));
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
          bodyStyle       = {{ width: 700, height: 355 }}
          style           = {{ minWidth: 700 }}
        >
          <Spin spinning = { this.props.isProcessing }>
            <Tabs
              defaultActiveKey = "RFR"
              tabPosition      = 'left'
              style            = {{ height: 355 }}
              tabBarStyle      = {{ textAlign: "left !important" }}
            >
              <TabPane 
                tab   = 'Остатки'
                key   = 'RFR'
                style = {{ marginLeft: -7, marginTop: 7 }}
                >
                <Configurator allFields             = { this.state.allFields['RFR'] }
                              visibleFields         = { this.state.visibleFields['RFR'] }
                              pageSize              = { this.state.pageSize['RFR'] }
                              onTargetKeysChange    = { (targetKeys) => { this.onTargetKayesChange('RFR', targetKeys) } } 
                              onPageSizeChange      = { (newValue) => { this.onPageSizeChange('RFR', newValue) } }
                               />
              </TabPane>
              
              <TabPane 
                tab   = "В пути"
                key   = "RFIT"
                style = {{ marginLeft: -7, marginTop: 7 }}
                >
                <Configurator allFields             = { this.state.allFields['RFIT'] }
                              visibleFields         = { this.state.visibleFields['RFIT'] }
                              pageSize              = { this.state.pageSize['RFIT'] }
                              onTargetKeysChange    = { (targetKeys) => { this.onTargetKayesChange('RFIT', targetKeys) } }
                              onPageSizeChange      = { (newValue) => { this.onPageSizeChange('RFIT', newValue) } } />
              </TabPane>
              
              <TabPane 
                tab="Материалы" 
                key="FRM"
                style = {{ marginLeft: -7, marginTop: 7 }}
                >
                <Configurator allFields             = { this.state.allFields['RFM'] }
                              visibleFields         = { this.state.visibleFields['RFM'] }
                              pageSize              = { this.state.pageSize['RFM'] }
                              onTargetKeysChange    = { (targetKeys) => { this.onTargetKayesChange('RFM', targetKeys) } }
                              onPageSizeChange      = { (newValue) => { this.onPageSizeChange('RFM', newValue) } } />
              </TabPane>
              
              <TabPane
                tab="Позиции"
                key="POS"
                style = {{ marginLeft: -7, marginTop: 7 }}
                >
                <Configurator allFields             = { this.state.allFields['POS'] }
                              visibleFields         = { this.state.visibleFields['POS'] }
                              pageSize              = { this.state.pageSize['POS'] }
                              onTargetKeysChange    = { (targetKeys) => { this.onTargetKayesChange('POS', targetKeys); } }
                              onPageSizeChange      = { (newValue) => { this.onPageSizeChange('POS', newValue); } } />
              </TabPane>
            </Tabs>
          </Spin>
        </Modal>
    );
  }
}