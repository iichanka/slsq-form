import axios from 'axios';
import { showMessages }     from '../messages';
import { store }            from '../../index';
import { updateItems }      from '../positions/main';


export const getServices = (records) => {
  console.log('getServices POST');
  console.log(records);

  if(records.length > 0){

      axios.post(localStorage.getItem('AjaxURL'), {
        action: 'getServices',
        data: records
      })
      .then(response => {
        let haveError = false;
        showMessages(response.data.messages || [], haveError);
      
        console.log('getServices responce');
        console.log(response);
        
        if(!haveError)
        {
          store.dispatch({ type: 'S_LIST_SERVICES', data: response.data.data});
        }
        
      })
      .catch(function (error) {
        console.log('getServices post error: ', error);
        showMessages([{type: 'E', text: 'Не удалось проверить возможность заказа услуг.'}]);
      });

  }else{
    store.dispatch({ type: 'S_LIST_SERVICES_DEFAULT'});
  }

}

export const setServices = (services) => {
  console.log('setServices POST');
  console.log(services);

  axios.post(localStorage.getItem('AjaxURL'), {
    action: 'addService',
    data: services
  })
  .then(response => {
    let haveError = false;
    showMessages(response.data.messages || [], haveError);
  
    console.log('setServices responce');
    console.log(response);

    if(!haveError)
    {
      store.dispatch(updateItems(response.data.data));
    }
    
  })
  .catch(function (error) {
    console.log('getServices post error: ', error);
    showMessages([{type: 'E', text: 'Не удалось добавить услугу.'}]);
  });

}