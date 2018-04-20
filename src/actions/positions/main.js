import axios from 'axios';
import { showMessages } from '../messages';

export const P_REQUEST_ITEMS        = 'P_REQUEST_ITEMS';
export const P_RECEIVE_ITEMS        = 'P_RECEIVE_ITEMS';
export const P_END_REQUEST_ITEM     = 'P_END_REQUEST_ITEM';

export const requestItems = () => ({
  type: P_REQUEST_ITEMS
})

export const endRequestItems = () => ({
  type: P_END_REQUEST_ITEM
})

export const receiveItems = (data) => {
  return ({
    type: P_RECEIVE_ITEMS,
    items: data,
  });
}

export const loadItems = () => dispatch => {
  dispatch(requestItems());

  axios.get(localStorage.getItem('AjaxURL'), {
    params: {
      action: "loadPositions",
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
    showMessages([{type: 'E', text: 'Не удалось получить список позиций.'}]);
    dispatch(endRequestItems());
  });
  
}
