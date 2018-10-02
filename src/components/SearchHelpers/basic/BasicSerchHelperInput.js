import React from 'react';
import { Icon, Modal, Input } from 'antd';
import BasicSearchHelper from './BasicSearchHelper';


class BasicSearchHelperInput extends React.Component {
    constructor(props) {
        super(props); 

        let defValue = '';
        if(props.initialValue || props.initialValue != undefined ){
            defValue = props.initialValue;
        }

        this.state = {
            showHelper: false,
            value: defValue
        }
    }

    // catch props change
    componentWillReceiveProps(nextProps) {
        if(nextProps.initialValue || nextProps.initialValue != undefined){
            this.setState({
                value: nextProps.initialValue
            });
        }
    }
    
    handleChange = (event) => {
        console.log('handleChange helper');
        console.log(event.target.value );
        var val = event.target.value;
        this.setState({ value: val});

        this.props.updateSearchHelperValue(this.props.inputName, val);
    }

    showHelper = () => {
        this.setState({ showHelper : true});
    }

    hideHelper =() => {
        this.setState({ showHelper: false })
    }
    
    // при клике на строку таблицы
    helperValueSelect = (record, index) => {
        console.log('клик на строку таблицы хелпера');
        console.log(record);
        // устанавливаем новое значение
        this.setState({ value : record.id });
        // обновяем данные в форме
        this.props.updateSearchHelperValue(this.props.inputName, record.id);
        this.hideHelper();
    }

    // ловим нажатие F4
    handleKeyPress = (e) => {
        //115 = F4
        if (e.keyCode == 115) {
            this.showHelper();
        }
    }

    render() {
        return(
            <div className="helper-wrapp">
                <div className="ant-row ant-form-item">
                    {this.props.inputLabel &&
                        <div className="ant-form-item-label">
                            <label title={this.props.inputLabel}>{this.props.inputLabel}</label>
                        </div>
                    }
                    <div className="ant-form-item-control">
                        <Input
                            name        = { this.props.inputName }
                            value       = { this.state.value } 
                            onChange    = { this.handleChange }
                            onKeyUp     = { this.handleKeyPress }
                            addonAfter  = { <Icon type="form"  onClick = { event => this.showHelper() }/> }
                            size        = "small"
                            />
                            { <BasicSearchHelper
                                visible = { this.state.showHelper }
                                helperTitle = { this.props.helperTitle }
                                onSelect = { this.onSelectValueFromHelper } 
                                hideHelper = { this.hideHelper }
                                inputValue = { this.state.value }
                                dataGetAction = { this.props.dataGetAction }
                                helperValueSelect = { this.helperValueSelect }
                            /> }
                    </div>
                </div>
            </div>
        );
    }
}
BasicSearchHelperInput.defaultProps = {
    inputName: "default_input_name",
};


export default BasicSearchHelperInput;