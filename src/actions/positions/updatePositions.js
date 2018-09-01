import axios from 'axios';
import { showMessages } from '../messages';
import { requestItems, endRequestItems, updateItems }  from './main';


export const updatePositions = (records = []) => dispatch => {
  let positions = records.filter(record => !!record._changed) || [];
  if(positions.length <= 0)
  {
    return;
  }

  dispatch(requestItems());

  let msg = {
      positions: positions
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
