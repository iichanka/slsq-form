import axios from 'axios';
import { showMessages } from '../messages';
import { requestItems, endRequestItems, receiveItems } from './main';


export const calcPositionSum = () => dispatch => {
  dispatch(requestItems());

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
        dispatch(receiveItems(response.data.data));
    }
    dispatch(endRequestItems());
  })
  .catch(function (error) {
    showMessages([{type: 'E', text: 'Не удалось рассчитать цены.'}]);
    dispatch(endRequestItems());
  });
  
}
