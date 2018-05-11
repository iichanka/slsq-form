import React                                                from 'react';
import { Modal }                                            from 'antd';
import PropTypes                                            from 'prop-types';
import Transfer                                             from '../../components/transfer/index';

export default class Configurator extends React.Component {
  static propTypes = {   
    visible:        PropTypes.bool.isRequired,
    config:         PropTypes.object.isRequired,
    onSave:         PropTypes.func.isRequired,
    onClose:        PropTypes.func.isRequired,
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
    console.log('containers.configurator.configurator.getStateFromProps[props]', props);
    const { config, visible } = props;

    let newState = { 
      ...this.state,
      visible: visible,
      selectedKeys: [],
      allFields: config.columns,
      visibleFields: config.columns.map( column => {
        return column.visible ? column.key : null;
      }).filter( column => !!column )
    }

    console.log('containers.configurator.configurator.getStateFromProps[newState]', newState);
    return newState;
  }


  filterOption = (inputValue, option) => {
    return option.title.toLowerCase.indexOf(inputValue.toLowerCase) > -1;
  }

  handleChange = (targetKeys) => {
    console.log('containers.configurator.configurator.handleChange[targetKeys]', targetKeys);
    this.setState({ targetKeys });
  }

  onSelectChange = (sourceSelectedKeys, targetSelectedKeys) => {
    console.log('containers.configurator.configurator.onSelectChange[sourceSelectedKeys, targetSelectedKeys]', sourceSelectedKeys, targetSelectedKeys);
    this.setState({ selectedKeys: [...sourceSelectedKeys, ...targetSelectedKeys] });
  }

  render() {
    return (
      <Modal
          title     = "Конфигуратор"
          visible   = { this.state.visible }
          onOk      = { this.props.onSave }
          onCancel  = { this.props.onClose }
          okText    = 'Сохранить'
          style     = {{ width: 700 }}
        >
          <Transfer
            dataSource        = { this.state.allFields}
            showSearch        = { true }
            filterOption      = { this.filterOption }
            targetKeys        = { this.state.visibleFields }
            onChange          = { this.handleChange }
            render            = { item => item.title }
            onSelectChange    = { this.onSelectChange }
            searchPlaceholder = 'Введите название столбца'
            listStyle         = {{
              width: 250,
              height: 400,
            }}
          />
        </Modal>
    );
  }
}