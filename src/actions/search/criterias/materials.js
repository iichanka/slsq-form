import axios from 'axios';
import { showMessages }     from '../../messages';
// import { store }            from '../../index';


export const loadMaterailAttributes = (materalClass, callbackFunction) => {

  console.log('loadMaterailAttributes request - '+materalClass);
  axios.post(localStorage.getItem('AjaxURL'), {
    action: 'getSBMClassAttributes',
    class: materalClass
  })
  .then(response => {
    let haveError = false;
    showMessages(response.data.messages || [], haveError);
  
    console.log('loadMaterailAttributes responce');
    console.log(response.data.data);
    
    if(!haveError)
    {
      console.log('send callbackFunction');
      callbackFunction(response.data.data);
    }
    
  })
  .catch(function (error) {
    console.log('loadMaterailAttributes post error: ', error);
    showMessages([{type: 'E', text: 'Не удалось получить список признаков.'}]);
  });


}
