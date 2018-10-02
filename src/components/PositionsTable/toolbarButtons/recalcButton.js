import React from 'react';
import { Button, Tooltip, Icon, Divider } from 'antd';
import { calcPositionSum } from "../../../actions/positions/calcPositionsSum";

export class recalcButton extends React.Component {

    constructor(props) {
        super(props);
        // props = { active:false };
    }


    render() {
        return (
            <span>
            <Tooltip title   = "Пересчитать цены">
                <Button type="primary" size = "small"
                    style = {{ lineHeight: 1 }}
                    onClick = { event => calcPositionSum() } >
                    <Icon type="reload" />
                    Пересчитать цены
                </Button>
            </Tooltip>
            </span>
        );
    }
    
}

export default recalcButton;