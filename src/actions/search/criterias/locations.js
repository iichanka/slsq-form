import axios from 'axios';
import { showMessages } from '../../messages';

export const SCL_REQUEST_ITEMS  = 'SCL_REQUEST_ITEMS';
export const SCL_RECEIVE_ITEMS  = 'SCL_RECEIVE_ITEMS';
export const SCL_SELECT_ITEM    = 'SCL_SELECT_ITEM';

export const requestItems = () => ({
  type: SCL_REQUEST_ITEMS
})

export const selectItem = itemID => ({
  type: SCL_SELECT_ITEM,
  itemID
})

export const receiveItems = (data) => {
  return ({
    type: SCL_RECEIVE_ITEMS,
    items: data,
  });
}

export const loadItems = () => dispatch => {
  dispatch(requestItems());

  axios.get(localStorage.getItem('AjaxURL'), {
    params: {
      action: "searchCriteriasLoad",
      type : "SBL",
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
  })
  .catch(function (error) {
    showMessages([{type: 'E', text: 'Не удалось получить группы местоположений.'}]);
    dispatch(receiveItems([]));
  });
  
}
