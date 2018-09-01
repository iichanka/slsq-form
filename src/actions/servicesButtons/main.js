import axios from 'axios';
import { showMessages } from '../messages';



export const checkButtonsAvailability = (records) => dispatch => {
  // console.log('checkButtonsAvailability POST');
  // console.log(records);

  if(records.length > 0){
    axios.post(localStorage.getItem('AjaxURL'), {
      action: 'getButtonsAvailability',
      data:   records
    })
    .then(response => {
      let haveError = false;
      showMessages(response.data.messages || [], haveError);
    
      console.log('checkButtonsAvailability responce');
      console.log(response);
      if(!haveError)
      {
        dispatch({ type: 'P_CHECK_BUTTONS', availability: response.data});
      }
      
    })
    .catch(function (error) {
      console.log('checkButtonsAvailability post error: ', error);
      showMessages([{type: 'E', text: 'Не удалось проверить возможность заказа услуг.'}]);
    });
  }else{
    dispatch({ type: 'P_CHECK_BUTTONS_DEFAULT'});
  }

}