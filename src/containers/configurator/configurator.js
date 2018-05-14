import React                                                from 'react';
import { Transfer, InputNumber, Row, Col }                  from 'antd';
import PropTypes                                            from 'prop-types';

const initialState = {
  allFields: [],
  selectedKeys: [],
  visibleFields: [],
  pageSize: 0,
}

export default class Configurator extends React.Component {
  static propTypes = {   
    allFields:          PropTypes.object.isRequired,
    visibleFields:      PropTypes.func.isRequired,
    pageSize:           PropTypes.number.isRequired,
    onTargetKeysChange: PropTypes.func.isRequired,
    onPageSizeChange:   PropTypes.func.isRequired,
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
    const { allFields, visibleFields, pageSize } = props;

    if(!allFields)
    {
      return initialState;
    }

    let newState = { 
      selectedKeys: [],
      allFields: allFields.map( field => {
        if(field.technical)
        {
          return null;
        }
        return field;
      }).filter( field => !!field ),
      visibleFields: visibleFields,
      pageSize: pageSize,
    }

    console.log('containers.configurator.configurator.getStateFromProps[newState]', newState);
    return newState;
  }


  filterOption = (inputValue, option) => {
    return option.title.toLowerCase.indexOf(inputValue.toLowerCase) > -1;
  }

  handleChange = (targetKeys) => {
    console.log('containers.configurator.configurator.handleChange[targetKeys]', targetKeys);
    this.props.onTargetKeysChange(targetKeys);
    this.setState({ targetKeys });
  }

  onSelectChange = (sourceSelectedKeys, targetSelectedKeys) => {
    console.log('containers.configurator.configurator.onSelectChange[sourceSelectedKeys, targetSelectedKeys]', sourceSelectedKeys, targetSelectedKeys);
    this.setState({ selectedKeys: [...sourceSelectedKeys, ...targetSelectedKeys] });
  }

  render() {
    return (
      <div>
        <Row>
          <Col span = { 24 } >
            Количество строк на страницу: 
            <InputNumber 
              value     = { this.props.pageSize }
              onChange  = { this.props.onPageSizeChange }
              min       = { 0 }
              size      = 'small'
              style     = {{ marginLeft: 5 }}
              />
            {
              this.props.pageSize === 0 && <span style = {{ marginLeft: 5 }}>Бесконечная страница</span>
            }
          </Col>
        </Row>
        <Row style = {{ marginTop: 15 }}>
          <Col span = { 24 } >
            <Transfer
              dataSource        = { this.state.allFields}
              showSearch        = { true }
              filterOption      = { this.filterOption }
              targetKeys        = { this.state.visibleFields }
              onChange          = { this.handleChange }
              render            = { item => item.title }
              onSelectChange    = { this.onSelectChange }
              searchPlaceholder = 'Введите название столбца'
              titles            = { ['Доступные столбцы', 'Показываемые столбцы'] }
              listStyle         = {{
                width: 250,
                height: 300,
              }}
            />
          </Col>
        </Row>
      </div>
    );
  }
}