import React from 'react';
import { Button, Tooltip, Icon, Modal, Divider } from 'antd';
import { store } from '../../index';
import { connect } from 'react-redux';
import ServiceForm from './forms/serviceForm';
import { getServices } from "../../../actions/servicesButtons/serviceForm";

export class ServiceButton extends React.Component {

    constructor(props) {
        super(props);
        props = { active:false };
    }

    state = { visibleForm: false }

    showServiceForm()
    {
        getServices(this.props.selectedPosition);

        this.setState({
            visibleForm: true,
        });
    }

    handleOk = (e) => {
        this.setState({
            visibleForm: false,
        });
    }

    handleCancel = (e) => {
        this.setState({
            visibleForm: false,
        });
    }

    closeForm = () => {
        this.setState({ visibleForm: false })
    }

    render() {
        return (
            <span>
            <Tooltip title   = "Добавить услугу">
                <Button type="primary" size = "small"
                    style = {{ lineHeight: 1 }}
                    disabled = {!this.props.active}
                    onClick = { event => this.showServiceForm() } >
                    Добавить услугу 
                    <Icon type="plus" />
                </Button>
            </Tooltip>
            <Modal
                title="Выберите услугу из списка"
                visible={this.state.visibleForm}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
            >
                <ServiceForm closeForm={this.closeForm}/>
            </Modal>
            </span>
        );
    }
    
}

const mapStateToProps = state => {
    console.log('mapStateToProps');
    console.log(state);
    return { 
        active: state.serviceButtonsState.service,
        selectedPosition: state.selectedPosition,
    };
};

export default connect(mapStateToProps)(ServiceButton);