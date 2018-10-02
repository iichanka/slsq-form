import axios from 'axios';
import { showMessages } from '../messages';
import { requestItems, endRequestItems, receiveItems } from './main';
import { store }            from '../../index';

export const calcPositionSum = () => {
  store.dispatch(requestItems());

  axios.get(localStorage.getItem('AjaxURL'), {
    params: {
      action: "calcPositionsSum",
      },
    headers: {
      "Upgrade-Insecure-Requests": 1
    }
  })
  .then(response => {
    let haveError = false;
    showMessages(response.data.messages || [], haveError);
   
    if(!haveError)
    {
      store.dispatch(receiveItems(response.data.data));
    }
    store.dispatch(endRequestItems());
  })
  .catch(function (error) {
    showMessages([{type: 'E', text: 'Не удалось рассчитать цены.'}]);
    store.dispatch(endRequestItems());
  });
  
}
