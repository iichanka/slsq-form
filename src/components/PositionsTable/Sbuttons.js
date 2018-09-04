import React from 'react';
import { Button, Tooltip } from 'antd';
import DeliveryButton from './toolbarButtons/deliveryButton'
import ServiceButton from './toolbarButtons/serviceButton'
import FileButton from './toolbarButtons/fileButton'

const ButtonGroup = Button.Group;

export class Sbuttons extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div class="ant-tabs-nav-wrap">
                <ButtonGroup style = {{ margin: '5px'}} >
                    <FileButton />
                    <DeliveryButton />
                    <ServiceButton />
                </ButtonGroup>
            </div>
        );
    }
}

export default Sbuttons;