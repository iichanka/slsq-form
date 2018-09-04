import React from 'react';
import { Icon, Modal, Input } from 'antd';
import BasicSearchHelper from './BasicSearchHelper';


class BasicSearchHelperPositionField extends React.Component {
    constructor(props) {
        super(props); 

        this.state = {
            showHelper: false,
            value: '',
        }
    }
    
    handleChange = (event) => {
        let value = event.target.value;
        this.props.onLocalChange(value);
    }

    showHelper = () => {
        this.setState({ showHelper : true});
    }

    hideHelper =() => {
        this.setState({ showHelper: false })
    }
    
    // при клике на строку таблицы
    helperValueSelect = (record, index) => {
        this.hideHelper();
        // устанавливаем новое значение
        this.props.onSHSelect(record.id);
        /* this.props.onLocalChange(record.id);
        this.props.onBlur();         */
    }

    // ловим нажатие F4
    handleKeyPress = (e) => {
        //115 = F4
        if (e.keyCode == 115 && !this.props.isBlocked) {
            this.showHelper();
        }
    }

    handlePressEnter = () => {
        this.props.onPressEnter();
    }

    handleBlur = () => {
        this.props.onBlur();
    }


    render() {
        return(
            <div
                className = 'field-no-wrap'
                style     = {{ maxWidth: this.props.width }}
            >
                <Input
                    style       = { {textAlign: this.props.align} }
                    value       = { this.props.value } 
                    onChange    = { this.handleChange }
                    onKeyUp     = { this.handleKeyPress }
                    onPressEnter= { this.handlePressEnter }
                    onBlur      = { this.handleBlur }
                    addonAfter  = {<Icon type="form"  onClick = { event => this.showHelper() }/>}
                    size        = "small"
                    disabled    = { this.props.isBlocked }
                    />
                <BasicSearchHelper
                    visible             = { this.state.showHelper }
                    helperTitle         = { this.props.helperTitle }
                    onSelect            = { this.onSelectValueFromHelper } 
                    hideHelper          = { this.hideHelper }
                    inputValue          = { this.props.value }
                    dataGetAction       = { this.props.dataIndex }
                    record              = { this.props.record }
                    helperValueSelect   = { this.helperValueSelect }
                /> 
            </div>
        );
    }
}
BasicSearchHelperPositionField.defaultProps = {
    isBlocked: false,
    onLocalChange: (v) => { console.log('BasicSearchHelperPositionField.props.onLocalChange is not defined!') },
    
};


export default BasicSearchHelperPositionField;