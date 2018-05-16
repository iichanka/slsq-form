import axios from 'axios';
import { showMessages } from '../messages';
import { requestItems, endRequestItems, receiveItems }  from './main';
import { clone }                                        from '../../utils';


export const addPositionItem = (record) => dispatch => {
  dispatch(requestItems());

  if(record.remnants.countInputReference)
  {
    delete record.remnants.countInputReference;
  }

  axios.post(localStorage.getItem('AjaxURL'), {
    action:   'addPositionItem',              
    data: record
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
    console.log('addPositionItem post error: ', error);
    showMessages([{type: 'E', text: 'Не удалось добавить позицию.'}]);
    dispatch(endRequestItems());
  });
  
}
