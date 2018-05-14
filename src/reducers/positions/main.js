import { P_REQUEST_ITEMS }      from '../../actions/positions/main';
import { P_RECEIVE_ITEMS }      from '../../actions/positions/main';
import { P_END_REQUEST_ITEM }   from '../../actions/positions/main';
import { P_LOCAL_UPDATE_ITEM }  from '../../actions/positions/main';

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
            return action.items.map( item => {
                item.quantity   = item.quantity.trim().replace(/\./g,'').replace('.','').replace(',','.');
                item.price      = item.price.trim().replace(/\./g,'').replace('.','').replace(',','.');
                item.sum        = item.sum.trim().replace(/\./g,'').replace('.','').replace(',','.');
                return item;
            });
        }

        case P_LOCAL_UPDATE_ITEM:
        {
            return localUpdateItem(state, action);
        }

        default:
        {
            return state;
        }
    }
}

const localUpdateItem = (items = [], action) => {
  let updatedItemsList = items.map( item => {
    if(item.guid === action.item.guid)
    {
      item = {...action.item};
    }
    return item;
  });

  console.log('reducers.positions.main.localUpdateItem(oldItems, action, newItems)', items, action, updatedItemsList);
  return updatedItemsList;
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