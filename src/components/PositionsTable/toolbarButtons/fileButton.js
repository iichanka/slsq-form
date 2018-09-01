import React from 'react';
import { Button, Tooltip, Icon, Divider } from 'antd';
import { createPositionItem } from "../../../actions/positions/createPosition";

export class FileButton extends React.Component {

    constructor(props) {
        super(props);
        // props = { active:false };
    }


    addPositionItem()
    {
        createPositionItem();
    }


    render() {
        return (
            <span>
            <Tooltip title   = "Добавить позицию">
                <Button type="primary" size = "small"
                    style = {{ lineHeight: 1 }}
                    onClick = { event => this.addPositionItem() } >
                    <Icon type="file" />
                </Button>
            </Tooltip>
            </span>
        );
    }
    
}

export default FileButton;