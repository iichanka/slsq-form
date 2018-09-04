import axios from 'axios';
import { showMessages }     from '../messages';
import { store }            from '../../index';
import { updateItems }      from '../positions/main';

// получаем данные категорий доставок
export const getDeliveryTypeList = () => {

  axios.post(localStorage.getItem('AjaxURL'), {
    action: 'getShipmentCategories'
  })
  .then(response => {
    let haveError = false;
    showMessages(response.data.messages || [], haveError);
  
    console.log('getShipmentCategories responce');
    console.log(response);


    if(!haveError)
    {
      store.dispatch({ type: 'D_DELIVERY_TYPE', data: response.data.data});
    }else{
      store.dispatch({ type: 'D_DELIVERY_TYPE_DEFAULT'});
    }
    
  })
  .catch(function (error) {
    console.log('getShipmentCategories post error: ', error);
    showMessages([{type: 'E', text: 'Не удалось получить список доставок.'}]);
  });


}

// получаем данные доступных доставок
export const getAvailableDeliverylist = (deliveryType, tonnage='', length='', updateData) => {
  console.log('GetAvailableDeliverylist POST');
  console.log(deliveryType);
  console.log(tonnage);
  console.log(length);

  axios.post(localStorage.getItem('AjaxURL'), {
    action: 'getAutodeliveryList',
    category: deliveryType,
    tonnage: tonnage,
    length: length
  })
  .then(response => {
    let haveError = false;
    showMessages(response.data.messages || [], haveError);
  
    console.log('GetAvailableDeliverylist responce');
    console.log(response);
    if(!haveError)
    {
      updateData(response.data.data);
    }
    
  })
  .catch(function (error) {
    console.log('getServices post error: ', error);
    showMessages([{type: 'E', text: 'Не удалось получить список доступных доставок.'}]);
  });

}

// отправляем данные формы доставки
export const sendDeliveryForm = (records, formData) => {
  console.log('sendDeliveryForm POST');
  console.log(records);
  console.log(formData);

  axios.post(localStorage.getItem('AjaxURL'), {
    action: 'addAutoDelivery',
    records: records,
    data: formData
  })
  .then(response => {
    let haveError = false;
    showMessages(response.data.messages || [], haveError);
  
    console.log('sendDeliveryForm responce');
    console.log(response);

    if(!haveError)
    {
      store.dispatch(updateItems(response.data.data));
    }
    
  })
  .catch(function (error) {
    console.log('sendDeliveryForm post error: ', error);
    showMessages([{type: 'E', text: 'Не удалось добавить автодоставку.'}]);
  });

}