import React from 'react';
import { connect } from 'react-redux';
import { store } from '../../../../index';
import { Input, Icon, Row, Col, Button, Modal, Spin} from 'antd';
import BasicSearchHelperInput from "../../../../components/SearchHelpers/basic/BasicSerchHelperInput";
import { loadMaterailAttributes }  from '../../../../actions/search/criterias/materials';

// список признаков
class AttributesList extends React.Component {

    constructor(props) {
        super(props);

        let newData = this.setOriginalMeta(props.data);

        this.state = {
            isLoading: false,
            attributesList: newData,
        };
    }
    
    // catch props change
    componentWillReceiveProps(nextProps) {

        // console.log('resive props',nextProps);

        this.setState({
            attributesList: nextProps.data,
        });
    }

    // добавляем метку оригинала к массиву приходящему сверху
    setOriginalMeta(data){
        data.map((attribute) => {
            attribute.original = true;
            attribute.low = '';
            attribute.high = '';
        });
        return data;
    }

    addRowCopy = (arrayKey) => {
        // получаем копию массива
        let copyRow = Object.assign({}, this.state.attributesList[arrayKey]);
        copyRow.copy = true;
        // вставляем копию строки в список атрибутов после копируемого элемента
        this.state.attributesList.splice(arrayKey+1,0,copyRow);
        // отправляем измененный массив в state
        this.setState({});
    }

    deleteRow = (arrayKey) => {
        // удаляем строку массива
        this.state.attributesList.splice(arrayKey,1);
        // обновляем state
        this.setState({});
    }
        
    // обновляем данные формы при вводе значения в хелпер
    updateAttributesValue = (inputName, newValue) => {

        let inputInfo = inputName.split('_');
        let type = inputInfo[0];
        let arrayKey = parseInt(inputInfo[1]);

        let tempArray = this.state.attributesList;
        // меняем строку массива
        if(type == 'low'){
            tempArray[arrayKey].low = newValue;
        }else if(type == 'high'){
            tempArray[arrayKey].high = newValue;
        }
        
        // отправляем измененный массив в state
        this.setState({
            attributesList: tempArray,
        });
        // console.log('updateAttributesValue - inputInfo', inputInfo);
        // console.log('updateAttributesValue - type', type);
        // console.log('updateAttributesValue - arrayKey', arrayKey);
        // console.log('updateAttributesValue - tempArray', tempArray);
        let temp_items = [];
        tempArray.map((arItem, arrKey) =>{
            temp_items.push(
                {
                    "attr_id": arItem.id,
                    "low": arItem.low,
                    "high": arItem.high
                }
            );
        });

        let temp_stored_info = {
            class: this.props.SBMClass,
            data: temp_items
        };
        store.dispatch({ type: 'SBM_LIST_ATTRIBUTES', data: temp_stored_info });
    }
    
    render() {
        
        if (!this.state.attributesList.length) {
            return null;
        }

        // console.log('render attributes', this.state.attributesList);

        let listItems = this.state.attributesList.map((attribute, arrayKey) => 
            <li key={this.props.SBMClass+'_'+arrayKey.toString()}>
                <Row gutter={16}>
                    <Col className="gutter-row" span={6}>
                        {attribute.title}
                    </Col>
                    <Col className="gutter-row text-right" span={6}>
                        <BasicSearchHelperInput 
                            initialValue={ attribute.low ? attribute.low : '' }
                            dataGetAction={attribute.sh_action} // action для получения данных в список
                            helperTitle="Укажите значение" // Заголовк popup
                            inputName={'low_'+arrayKey}// name инпута
                            updateSearchHelperValue= { this.updateAttributesValue } // функция для обновления данных в форме, при изменении значения хелпера
                        />
                    </Col>
                    <Col className="gutter-row text-center" span={2}>по</Col>
                    <Col className="gutter-row" span={6}>
                        <BasicSearchHelperInput 
                            initialValue={ attribute.high ? attribute.high : '' }
                            dataGetAction={attribute.sh_action} // action для получения данных в список
                            helperTitle="Укажите значение" // Заголовк popup
                            inputName={'high_'+arrayKey}// name инпута
                            updateSearchHelperValue= { this.updateAttributesValue } // функция для обновления данных в форме, при изменении значения хелпера
                        />
                    </Col>
                    <Col className="gutter-row text-center" span={4}>
                        <Button onClick={this.addRowCopy.bind(this, arrayKey)} shape="circle" icon="plus"  size="small"/>
                        {attribute.copy &&
                            <Button onClick={this.deleteRow.bind(this, arrayKey)} shape="circle" icon="minus" size="small"/>
                        }
                    </Col>
                </Row>
            </li>
        );

        return (
            <ul className="search-attributes-list">
                {listItems}
            </ul>
        );
    }

}


class MateralSearch extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            isLoading: false,
            SBMClass: '',
            attributesList: [],
        };
    }
    
    // catch props change
    componentWillReceiveProps(nextProps) {
        this.setState({
            data: nextProps.data,
        });
    }

    // обновляем данные формы при вводе значения в хелпер класса
    updateClassValue = (inputName, newValue) => {
        this.setState({ [inputName]: newValue });
        // И вызываем подгрузку признаков
        loadMaterailAttributes(newValue, this.setAttributesList);
        // выставляем в store значени по умолчанию.
        store.dispatch({ type: 'SBM_LIST_ATTRIBUTES_DEFAULT' });
    }

    // callback для получения признаков
    setAttributesList = (data) => {
        this.setState({ attributesList: data });
    }

    // обновляем данные формы при вводе значения в хелпер
    updateSearchHelperValue = (inputName, newValue) => {
        this.setState({ attributesList: newValue })
    }

    render() {
        return (
        <Spin spinning={this.state.isLoading}>
            
            <BasicSearchHelperInput 
                dataGetAction="getSBMClasses" // action для получения данных в список
                helperTitle="Выберите класс" // Заголовк popup
                inputName="SBMClass" // name инпута
                inputLabel="Класс" // Label инпута
                updateSearchHelperValue= { this.updateClassValue } // функция для обновления данных в форме, при изменении значения хелпера
            />

            <AttributesList SBMClass = { this.state.SBMClass } data = {this.state.attributesList} ></AttributesList>

        </Spin>);
    }
}


export {
  MateralSearch,
}
export default
{
  MateralSearch,
}
