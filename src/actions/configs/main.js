import axios                    from 'axios';
import { showMessages }         from '../messages';

export const C_REQUEST_CONFIGS          = 'C_REQUEST_CONFIGS';
export const C_RECEIVE_CONFIGS          = 'C_RECEIVE_CONFIGS';
export const C_END_REQUEST_CONFIGS      = 'C_END_REQUEST_CONFIGS';

export const requestConfigs = () => {
    return {
        type: C_REQUEST_CONFIGS,
    }
}

export const receiveConfigs = (data) => {
    return {
        type: C_RECEIVE_CONFIGS,
        configs: data
    }
}

export const endRequestConfigs = () => {
    return {
        type: C_END_REQUEST_CONFIGS,
    }
}

export const load = () => (dispatch, getState) => {
    dispatch(requestConfigs);

    axios.get(localStorage.getItem('AjaxURL'), {
        params: {
          action: "loadConfigs",
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
            dispatch(receiveConfigs(response.data.data || []));
        }
      })
      .catch(function (error) {
        showMessages([{type: 'E', text: 'Не удалось получить конфигурации таблиц.'}]);
        dispatch(endRequestConfigs());
      });
}