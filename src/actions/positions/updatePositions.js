import axios from 'axios';
import { showMessages } from '../messages';
import { requestItems, endRequestItems, updateItems }  from './main';


export const updatePositions = (records) => dispatch => {
  dispatch(requestItems());

  let msg = {
      positions: records
  };

  axios.post(localStorage.getItem('AjaxURL'), {
    action: 'updatePositionItems',
    data:   msg
  })
  .then(response => {
    let haveError = false;
    showMessages(response.data.messages || [], haveError);
   
    if(!haveError)
    {
        dispatch(updateItems(response.data.data));
    }
    dispatch(endRequestItems());
  })
  .catch(function (error) {
    console.log('updatePositions post error: ', error);
    showMessages([{type: 'E', text: 'Не удалось обновить данные.'}]);
    dispatch(endRequestItems());
  });
  
}
