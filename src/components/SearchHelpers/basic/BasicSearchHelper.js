import React from 'react';
import { Table, Modal, Spin } from 'antd';
import { getBasicHelpersList } from '../../../actions/searchHelpers/basic';


class SearchHelperTable extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            selectedRow: '',
            data: [],
            columns: [
                { dataIndex: "id", title: "" },
                { dataIndex: "title", title: "" },
            ],
            loading: false
        };

    }

    componentDidMount(){
        this.setState({ loading: true });
        getBasicHelpersList( this.props.dataGetAction, this.props.inputValue, this.setListData, this.props.record);
    }

    setListData = (newData) => {
        // обновляем список когда пришел ответ от сервера
        this.setState({ columns: newData.columns });
        this.setState({ data: newData.data });
        this.setState({ loading: false });

    }

    componentWillReceiveProps = (newProps) => {
        if(this.props.inputValue != newProps.inputValue)
        {
            getBasicHelpersList( newProps.dataGetAction, newProps.inputValue, this.setListData, newProps.record);
        }
    }

    render() {

        return (
        <div className="helper-table">
        <Spin spinning={this.state.loading} delay={500}>
            <Table 
                onRow={(record, index) => {
                    return {
                        onClick: (e) => { // click row
                        this.props.helperValueSelect(record, index);
                        },       
                    };
                }}
                dataSource={ this.state.data } 
                scroll={{ y: 480 }} 
                pagination ={ false }
                showHeader = { false }
                columns = {this.state.columns}
            />
        </Spin>
        </div>
        )
    }

}

class BasicSearchHelper extends React.Component {

    render() {
  
      return (
        <Modal
            title = { this.props.helperTitle }
            visible = { this.props.visible }
            onOk = { this.handleOk }
            onCancel = { this.props.hideHelper }
            footer = { null }
            centered
        >
            <SearchHelperTable 
                inputValue={this.props.inputValue} 
                dataGetAction={this.props.dataGetAction} 
                helperValueSelect={this.props.helperValueSelect} 
                record  = { this.props.record }
            />
        </Modal>
      )
    }
  
}

BasicSearchHelper.defaultProps = {
    helperTitle: "Выберите значение", 
    columns: [],
    data: []
};

export default BasicSearchHelper;