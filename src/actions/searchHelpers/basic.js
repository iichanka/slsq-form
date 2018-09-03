import axios from 'axios';
import { showMessages }     from '../messages';
import { store }            from '../../index';


export const getBasicHelpersList = (actionName, inputValue='', callbackFunction, record = null) => {
  console.log('getBasicHelpersList request');
  console.log(actionName);
  console.log(inputValue);
  axios.post(localStorage.getItem('AjaxURL'), {
    action: 'getBasicSHValues',
    sh: actionName,
    currentvalue: inputValue,
    data: record
  })
  .then(response => {
    let haveError = false;
    showMessages(response.data.messages || [], haveError);
  
    console.log('getBasicHelpersList responce');
    console.log(response.data.data);
    
    if(!haveError)
    {
      console.log('send callbackFunction');
      callbackFunction(response.data.data);
    }
    
  })
  .catch(function (error) {
    console.log('getBasicHelpersList post error: ', error);
    showMessages([{type: 'E', text: 'Не удалось получить список значений поля.'}]);
  });


}

