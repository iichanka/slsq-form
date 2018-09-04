import axios from 'axios';
import { showMessages } from '../messages';
import { requestItems, endRequestItems, receiveItems }  from './main';
import { clone }                                        from '../../utils';
import { store }            from '../../index';

export const createPositionItem = () => {
  store.dispatch(requestItems());

  axios.post(localStorage.getItem('AjaxURL'), {
    action:   'createPositionItem'
  })
  .then(response => {
    let haveError = false;
    showMessages(response.data.messages || [], haveError);
   
    if(!haveError)
    {
      console.log('createPositionItem responce');
      console.log(response);
      store.dispatch(receiveItems(response.data.data));
    }
    store.dispatch(endRequestItems());
  })
  .catch(function (error) {
    console.log('createPositionItem post error: ', error);
    showMessages([{type: 'E', text: 'Не удалось добавить позицию.'}]);
    store.dispatch(endRequestItems());
  });
  
}
