import axios                    from 'axios';
import { showMessages }         from './messages';

export const F_LOAD_EDITABLE_STATUS     = 'F_LOAD_EDITABLE_STATUS';
export const F_RECEIVE_EDITABLE_STATUS  = 'F_RECEIVE_EDITABLE_STATUS';
export const F_END_LOAD_EDITABLE_STATUS = 'F_END_LOAD_EDITABLE_STATUS';

export const loadEditableStatus = () =>
{
    return {
        type: F_LOAD_EDITABLE_STATUS,
    }
}

export const receiveEditableStatus = ( isEditable ) =>
{
    return {
        type: F_RECEIVE_EDITABLE_STATUS,
        isEditable: isEditable,
    }
}

export const endLoadEditableStatus = () =>
{
    return {
        type: F_END_LOAD_EDITABLE_STATUS,
    }
}


export const getEditableStatus = () => (dispatch, getState) =>{
    dispatch(loadEditableStatus());
    
    axios.get(localStorage.getItem('AjaxURL'),  {
        params: {
          action: "loadEditableStatus",
          },
        headers: {
          "Upgrade-Insecure-Requests": 1
        }
    })
      .then(response => {
        let haveError = false;
        showMessages(response.data.messages, haveError);
       
        if(!haveError)
        {
            dispatch(receiveEditableStatus(response.data.isEditable));
            
        }
        dispatch(endLoadEditableStatus());
      })
      .catch(function (error) {
        showMessages([{type: 'E', text: 'Не удалось установить режим заявки (просмотр/редактирование).'}]);
        dispatch(endLoadEditableStatus());
      });
}