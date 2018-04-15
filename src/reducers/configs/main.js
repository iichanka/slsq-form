import { 
    C_REQUEST_CONFIGS,
    C_RECEIVE_CONFIGS,
    C_END_REQUEST_CONFIGS }         from '../../actions/configs/main';

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

export const configs = (state = {}, action) => {
    console.log("configs[state]:",  state);
    console.log("configs[action]:", action);
    return {
        ...state,
        isLoading:          isLoading(state.isLoading, action),
        tableConfigs:       tableConfigs(state.tableConfigs, action),
    }
}