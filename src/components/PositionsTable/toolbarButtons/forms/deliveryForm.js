import React from 'react';
import { connect } from 'react-redux';
import locale from 'antd/lib/date-picker/locale/ru_RU';
import moment from 'moment';
import 'moment/locale/ru';
import { Form, Input, InputNumber, Tooltip, Icon, Select, Row, Col, Checkbox, Button, AutoComplete, Table, DatePicker, Modal } from 'antd';
import { store } from '../../index';
import { getDeliveryTypeList, getAvailableDeliverylist, sendDeliveryForm} from "../../../../actions/servicesButtons/deliveryForm";
import BasicSearchHelperInput from "../../../../components/SearchHelpers/basic/BasicSerchHelperInput";

moment.locale('ru');

/*
const SelectRender = (props) => {
  const { fixedValues, children, align, width } = props;

  let title = children;
  let fixedValue = fixedValues.find(fixedVal => fixedVal.value === children);
  if(fixedValue)
  {
    title = fixedValue.title;
  }

  return(
    <Select         
      showSearch
      style             = {{ width }}
      optionFilterProp  = "children"
      onChange          = { (newValue) => { props.onFieldChange(newValue); } } 
      value             = { title }
      filterOption      = { (input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0 }
      size              = 'small'
    >
    {
      fixedValues.map( valueRange => {
        return(
          <Option value = { valueRange.value } >
            { valueRange.title }
          </Option>
        );
      })
    }
    </Select>
  );
}
*/

//
class DeliveryTable extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      selectedRow: '',
      data: props.data,
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      data: nextProps.data,
    });
  }
 

  render() {

    const columns= [
      {
        title: 'ID',
        dataIndex: 'id',
      },
      {
        title: 'title',
        dataIndex: 'title',
      },
    ];

    return (
      
      <Table 
        onRow={(record, index) => {
          return {
            onClick: (e) => { // click row
              this.props.tableRowSelect(record, index);
              
              const data = this.state.data;
              data.map((row) => {
                row.class=""
              });
              data[index].class = 'active';
        
              // update state
              this.setState({
                  data,
              });

              console.log(this.state.data);

            },       
          };
        }} 
        dataSource={ this.state.data } 
        scroll={{ y: 250 }} 
        pagination ={ false }
        showHeader = { false }
        columns = {columns}
        rowClassName={(record, index) => {
          return record.class;
        }}
      />
      
    )
  }
}



const FormItem = Form.Item;
const Option = Select.Option;
const confirm = Modal.confirm;

class DeliveryForm extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      deliveryList: [],
      shipmentType: '',
      machineRequirementType: '',
      machineUnloadType: '',
      transferReasonType: '',
      selectedDelivery: '',
    };

  }

  componentDidMount() {
    // Получаем данные для типа доставки
    if(!this.props.deliveryTypeList.length){
      getDeliveryTypeList();
    }
  }
  
  handleChange = (event) => {
    this.setState({value: event.target.value});
  }

  // при выборе типа автодоставки, сразу искать доступные автодоставки
  handleDeliveryTypeChange = (value) => {
    this.props.form.setFields({
      deliveryType: {
        value: value,
      },
    });
    this.getDeliveryList();
  }

  // обновляем данные формы при вводе значения в хелпер
  updateSearchHelperValue = (inputName, newValue) => {
    this.setState({ [inputName]: newValue })
  }

  
  getDeliveryList = () => {
    let deliveryType = this.props.form.getFieldValue('deliveryType');
    console.log('let deliveryType ');
    console.log(deliveryType);
    let tonnage = this.props.form.getFieldValue('tonnage');
    let length = this.props.form.getFieldValue('length');
    // Запрашиваем список доставок
    getAvailableDeliverylist(deliveryType, tonnage, length, this.setDeliveryList);
  }

  setDeliveryList = (newData) => {
    console.log('update delivery list');
    console.log(newData);
    
    // обновляем список когда пришел ответ от сервера
    this.setState({ deliveryList: newData });
  }

  // при клике на строку таблицы доставок
  tableRowSelect = (record, index) => {
    console.log('клик на строку таблицы доставок');
    console.log(record);
    this.setState({selectedDelivery: record.id});
  }


  // отпарвка формы
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);

        if(this.state.selectedDelivery!=''){
          
          let formData = {
            autodelivery: this.state.selectedDelivery,
            date: values.data,
            interval: values.timeRangeStart+' '+values.timeRangeEnd,
            shipmenttype: this.state.shipmentType,
            machinereqtype: this.state.machineRequirementType,
            machineunloadtype: this.state.machineUnloadType,
            transferreasontype: this.state.transferReasonType,
            docwoprice: values.doc_no_price,
            cutting: values.serv_cut,
            overload: values.overload,
            certs: values.certificate,
            reserve: values.reserve,
            comment: values.message
          };
          
          // отправляем данные формы
          sendDeliveryForm(this.props.selectedPosition, formData);
          
          this.handleReset();
        }

      }
    });
  }

  handleReset = () => {

    // очищаем данные формы
    this.props.form.resetFields();
    this.setState({
      deliveryList: [],
      shipmentType: '',
      machineRequirementType: '',
      machineUnloadType: '',
      transferReasonType: '',
      selectedDelivery: {},
    });

    //закрываем модальное окно
    this.props.closeForm();
  }

  
  render() {

    const { getFieldDecorator } = this.props.form;
    const { TextArea } = Input;
    const { MonthPicker, RangePicker } = DatePicker;


    // тестовые данные заголовков таблиц хелперов
    const JinputColumns = [
      { dataIndex: "id", title: "Номер адреса" },
      { dataIndex: "title", title: "Адрес" },
    ];
    const machineRequirementTypeinputColumns = [
      { dataIndex: "id", title: "Номер" },
      { dataIndex: "title", title: "Требование к машине" },
    ];
    const machineUnloadTypeinputColumns = [
      { dataIndex: "id", title: "Номер" },
      { dataIndex: "title", title: "Разгрузка" },
    ];
    const transferReasonTypeinputColumns = [
      { dataIndex: "id", title: "Номер" },
      { dataIndex: "title", title: "Основание для передачи" },
    ];



    return (
      <Form onSubmit={this.handleSubmit}>
      <div className="delivery-form-wrapp">
          <Row>
            <Col  span={24}>
                <FormItem
                  label="Тип доставки"
                >

                {getFieldDecorator('deliveryType')(
                  <Select
                    showSearch
                    placeholder="Выберите тип доставки"
                    optionFilterProp="children"
                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                    size="small"
                    onSelect={this.handleDeliveryTypeChange}
                  >
                    {
                      this.props.deliveryTypeList.map( optionValue => {
                        return(
                          <Option key={optionValue.category} value = { optionValue.category } >
                            { optionValue.title }
                          </Option>
                        );
                      })
                    }
                  </Select>
                  )}
                </FormItem>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col className="gutter-row" span={8}>
              <FormItem >
                {getFieldDecorator('tonnage')(
                  <InputNumber min={0}  placeholder="Тоннаж" size="small" />
                )}
              </FormItem>
            </Col>
            <Col className="gutter-row" span={8}>
              <FormItem >
                  {getFieldDecorator('length')(
                    <InputNumber min={0}  placeholder="Длина" size="small" />
                  )}
              </FormItem>
            </Col>
            <Col className="gutter-row" span={8}>
              <FormItem>
                <Button  onClick={this.getDeliveryList} icon="search" style={{width: '100%'}} size="small" >Поиск</Button>
              </FormItem>
            </Col>
          </Row>

          {/* Таблица доставок */}
          <div className="delivery-table">
            <DeliveryTable data={this.state.deliveryList} tableRowSelect={this.tableRowSelect}  />
          </div>

          <Row gutter={16}>
            <Col className="gutter-row" span={8}>
              <FormItem label="Дата доставки">
                {getFieldDecorator('data')(
                  <DatePicker locale={locale} size="small"/>
                )}
              </FormItem>
            </Col>
            <Col className="gutter-row" span={8}>
              <FormItem label="Окно c">
                  {getFieldDecorator('timeRangeStart')(
                    <DatePicker
                      mode='time'
                      showTime={{ format: 'HH:mm:ss' }}
                      format="HH:mm:ss"
                      placeholder='C'
                      locale={locale}
                      size="small"
                    />
                  )}
              </FormItem>
            </Col>
            <Col className="gutter-row" span={8}>
              <FormItem label="по">
                  {getFieldDecorator('timeRangeEnd')(
                    <DatePicker
                      mode='time'
                      showTime={{ format: 'HH:mm:ss' }}
                      format="HH:mm:ss"
                      placeholder='По'
                      locale={locale}
                      size="small"
                    />
                  )}
              </FormItem>
            </Col>
          
          </Row>


          <Row gutter={16}>
            <Col className="gutter-row" span={12}>
              <BasicSearchHelperInput 
                dataGetAction="shipmentType" // action для получения данных в список
                helperTitle="Вид отгрузки" // Заголовк popup
                inputName="shipmentType" // name инпута
                inputLabel="Вид отгрузки" // Label инпута
                updateSearchHelperValue= { this.updateSearchHelperValue } // функция для обновления данных в форме, при изменении значения хелпера
              />
            </Col>
            <Col className="gutter-row" span={12}>
              <BasicSearchHelperInput 
                dataGetAction="machineRequirementType" // action для получения данных в список
                helperTitle="Требования к машине" // Заголовк popup
                inputName="machineRequirementType" // name инпута
                inputLabel="Требования к машине" // Label инпута
                updateSearchHelperValue= { this.updateSearchHelperValue } // функция для обновления данных в форме, при изменении значения хелпера
              />
            </Col>
          </Row>

          <Row gutter={16}>
            <Col className="gutter-row" span={12}>
              <BasicSearchHelperInput 
                dataGetAction="machineUnloadType" // action для получения данных в список
                helperTitle="Типы разгрузки" // Заголовк popup
                inputName="machineUnloadType" // name инпута
                inputLabel="Тип разгрузки" // Label инпута
                updateSearchHelperValue= { this.updateSearchHelperValue } // функция для обновления данных в форме, при изменении значения хелпера
              />
            </Col>
            <Col className="gutter-row" span={12}>
              <BasicSearchHelperInput 
                dataGetAction="transferReasonType" // action для получения данных в список
                helperTitle="Основания для передачи" // Заголовк popup
                inputName="transferReasonType" // name инпута
                inputLabel="Основание для передачи" // Label инпута
                updateSearchHelperValue= { this.updateSearchHelperValue } // функция для обновления данных в форме, при изменении значения хелпера
              />
            </Col>
          </Row>


          <Row className="checkboxes" gutter={16}>
            <Col className="gutter-row" span={8}>
              <FormItem>
                {getFieldDecorator('doc_no_price', {
                  valuePropName: 'checked',
                })(
                  <Checkbox>Док.без цены</Checkbox>
                )}
              </FormItem>
            </Col>
            <Col className="gutter-row" span={8}>
              <FormItem>
                {getFieldDecorator('serv_cut', {
                  valuePropName: 'checked',
                })(
                  <Checkbox>Резка</Checkbox>
                )}
              </FormItem>
            </Col>
            <Col className="gutter-row" span={8}>
              <FormItem>
                {getFieldDecorator('overload', {
                  valuePropName: 'checked',
                })(
                  <Checkbox>Перегруз</Checkbox>
                )}
              </FormItem>
            </Col>
          
          </Row>

          <Row className="checkboxes" gutter={16}>
            <Col className="gutter-row" span={8}>
              <FormItem>
                {getFieldDecorator('certificate', {
                  valuePropName: 'checked',
                })(
                  <Checkbox>Сертификаты</Checkbox>
                )}
              </FormItem>
            </Col>
            <Col className="gutter-row" span={8}>
              <FormItem>
                {getFieldDecorator('reserve', {
                  valuePropName: 'checked',
                })(
                  <Checkbox>Спец. резерв</Checkbox>
                )}
              </FormItem>
            </Col>

          </Row>
                
          <FormItem label="Комментарий">
            {getFieldDecorator('message')(
              <TextArea rows={2} />
            )}
          </FormItem>

          <div className="delivery-form-actions">
              <Button style={{ marginRight: 8 }} onClick={this.handleReset}>Отмена</Button>
              <Button type="primary" htmlType="submit">Добавить</Button>
          </div>
          

        </div>
      </Form>
    );
  }
}

const mapStateToProps = state => {
  console.log('mapStateToProps DeliveryForm');
  console.log(state);
  return { 
    deliveryTypeList: state.deliveryTypeList,
    selectedPosition: state.selectedPosition,
  };
};

const WrappedDeliveryForm = Form.create()(DeliveryForm);
export default connect(mapStateToProps)(WrappedDeliveryForm);

