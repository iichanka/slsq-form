import axios                    from 'axios';
import { showMessages }         from '../messages';

export const C_REQUEST_CONFIGS                  = 'C_REQUEST_CONFIGS';
export const C_RECEIVE_CONFIGS                  = 'C_RECEIVE_CONFIGS';
export const C_END_REQUEST_CONFIGS              = 'C_END_REQUEST_CONFIGS';
export const C_TOGGLE_PERSONALIZATION_ACTIVE    = 'C_TOGGLE_PERSONALIZATION_ACTIVE';
export const C_TOGGLE_CONFIGURATOR_VISIBLE      = 'C_TOGGLE_CONFIGURATOR_VISIBLE';

export const requestConfigs = () => {
    return {
        type: C_REQUEST_CONFIGS,
    }
}

export const toggleConfiguratorVisible = () => {
    return {
        type: C_TOGGLE_CONFIGURATOR_VISIBLE
    }
}

export const togglePersonalizationActive = () => {
    return {
        type: C_TOGGLE_PERSONALIZATION_ACTIVE
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
        dispatch(endRequestConfigs());
      })
      .catch(function (error) {
        showMessages([{type: 'E', text: 'Не удалось получить конфигурации таблиц.'}]);
        dispatch(endRequestConfigs());
      });
}

export const updateConfigs = (data) => dispatch => {
    dispatch(requestConfigs());
  
    axios.post(localStorage.getItem('AjaxURL'), {
      action:   'updateConfigs',              
      data:     data,
    })
    .then(response => {
      let haveError = false;
      showMessages(response.data.messages || [], haveError);
     
      if(!haveError)
      {
          dispatch(receiveConfigs(response.data.data || []));
      }
      dispatch(endRequestConfigs());
      dispatch(toggleConfiguratorVisible());
    })
    .catch(function (error) {
        console.log('updateConfigs: ', error, data);
        showMessages([{type: 'E', text: 'Не удалось обновить конфигурации таблиц.'}]);
        dispatch(endRequestConfigs());
        dispatch(toggleConfiguratorVisible());
    });
    
  }