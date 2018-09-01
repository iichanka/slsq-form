import React from 'react';
import { connect } from 'react-redux';
import { List } from 'antd';
import { store } from '../../index';
import { setServices } from "../../../../actions/servicesButtons/serviceForm";

class ServiceForm extends React.Component {

  constructor(props) {
    super(props);
  }

  selectItem(item) {
    console.log('serviceForm selected item:');
    console.log(item);
    let postData = { "item":item , "selected_positions": this.props.selectedPositions};
    // отправляем выделенные услуги
    setServices(postData);

    // закрываем форму
    this.props.closeForm();

  }

  render() {
    return (
      <List
        size="small"
        style = {{ padding: '0 10px' }}
        dataSource={ this.props.listData }
        renderItem={
          item => (<List.Item onClick = { event => this.selectItem(item) }>{item.title}</List.Item>)
        }
      />
    );
  }
}

const mapStateToProps = state => {
  console.log('mapStateToProps serviceForm');
  console.log(state);
  return { 
    listData: state.listServices,
    selectedPositions: state.selectedPosition
  };
};


export default connect(mapStateToProps)(ServiceForm);

