import axios from 'axios';
import { showMessages } from '../messages';
import { requestItems, endRequestItems, deleteItems }  from './main';


export const deletePositions = (records) => dispatch => {
  dispatch(requestItems());

  let msg = {
      positions: records
  };

  axios.post(localStorage.getItem('AjaxURL'), {
    action: 'deletePositionItems',
    data:   msg
  })
  .then(response => {
    let haveError = false;
    showMessages(response.data.messages || [], haveError);
   
    if(!haveError)
    {
        dispatch(deleteItems(response.data.data));
    }
    dispatch(endRequestItems());
  })
  .catch(function (error) {
    console.log('deletePositions post error: ', error);
    showMessages([{type: 'E', text: 'Не удалось удалить позиции.'}]);
    dispatch(endRequestItems());
  });
  
}
