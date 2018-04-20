import { P_REQUEST_ITEMS }      from '../../actions/positions/main';
import { P_RECEIVE_ITEMS }      from '../../actions/positions/main';
import { P_END_REQUEST_ITEM }   from '../../actions/positions/main';

const isLoading = (state = false, action) => {
    switch(action.type)
    {
        case P_REQUEST_ITEMS:
        {
            return true;
        }

        case P_RECEIVE_ITEMS:
        case P_END_REQUEST_ITEM:
        {
            return false;
        }

        default:
        {
            return state;
        }
    }
}

const items = (state = [], action) => {
    switch(action.type)
    {
        case P_RECEIVE_ITEMS:
        {
            return action.items;
        }

        default:
        {
            return state;
        }
    }
}


export const positions = (state = {}, action) => {
    return {
        isLoading: isLoading(state.isLoading, action),
        items: items(state.items, action),
    }
    console.log("positions[state]:",  state);
    console.log("positions[action]:", action);
    return state;
}