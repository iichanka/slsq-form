import React from 'react';
import { Button, Tooltip, Icon, Modal } from 'antd';
import { store } from '../../index';
import { connect } from "react-redux";
import DeliveryForm from './forms/deliveryForm';
// import { getServices } from "../../../actions/servicesButtons/serviceForm";

export class DeliveryButton extends React.Component {

    constructor(props) {
        super(props);
        props = { active:false };
    }

    state = { visibleForm: false }

    showForm()
    {
        // getServices(this.props.selectedPosition);

        this.setState({
            visibleForm: true,
        });
    }

    closeForm = () => {
        this.setState({ visibleForm: false })
    }

    // handleOk = (e) => {
    //     this.setState({
    //         visibleForm: false,
    //     });
    // }

    handleCancel = (e) => {
        this.setState({
            visibleForm: false,
        });
    }

    render() {
        return (
        <span>
            <Tooltip title   = "Добавить услугу автодоставки">
                <Button type="primary" size = "small"
                    style = {{ lineHeight: 1 }}
                    disabled = {!this.props.active}
                    onClick = { event => this.showForm() } >
                    Добавить автодоставку
                    <Icon type="plus" />
                    <Icon type="car" />
                </Button>
            </Tooltip>
            <Modal
                title="Добавление услуги автодоставки"
                visible={this.state.visibleForm}
                // onOk={this.handleOk}
                onCancel={this.handleCancel}
                footer = { null }
            >
                <DeliveryForm closeForm={this.closeForm}/>
            </Modal>
        </span>
        );
    }
    
}

const mapStateToProps = state => {
    console.log('mapStateToProps');
    console.log(state);
    return { active: state.serviceButtonsState.delivery };
};

export default connect(mapStateToProps)(DeliveryButton);