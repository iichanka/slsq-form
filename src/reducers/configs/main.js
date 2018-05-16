import { 
    C_REQUEST_CONFIGS,
    C_RECEIVE_CONFIGS,
    C_END_REQUEST_CONFIGS,
    C_TOGGLE_CONFIGURATOR_VISIBLE,
    C_TOGGLE_PERSONALIZATION_ACTIVE }         from '../../actions/configs/main';

import { tableConfigs }             from './tableConfigs';

const isLoading = (state = false, action) => {
    switch(action.type)
    {
        case C_REQUEST_CONFIGS:
        {
            return true;
        }

        case C_RECEIVE_CONFIGS:
        case C_END_REQUEST_CONFIGS:
        {
            return false;
        }

        default:
        {
            return state;
        }
    }
}

const isPersonalizationActive = (state = false, action) => {
    if(action.type === C_TOGGLE_PERSONALIZATION_ACTIVE)
    {
        return !state;
    }
    return state;
}

const isConfiguratorVisible = (state = false, action) => {
    if(action.type === C_TOGGLE_CONFIGURATOR_VISIBLE)
    {
        return !state;
    }
    return state;
}

export const configs = (state = {}, action) => {
    console.log("configs[state]:",  state);
    console.log("configs[action]:", action);
    return {
        ...state,
        isLoading:                  isLoading(state.isLoading, action),
        isPersonalizationActive:    isPersonalizationActive(state.isPersonalizationActive, action),
        isConfiguratorVisible:      isConfiguratorVisible(state.isConfiguratorVisible, action),
        tableConfigs:               tableConfigs(state.tableConfigs, action),
    }
}