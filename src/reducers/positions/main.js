import { P_REQUEST_ITEMS }      from '../../actions/positions/main';
import { P_RECEIVE_ITEMS }      from '../../actions/positions/main';
import { P_END_REQUEST_ITEM }   from '../../actions/positions/main';
import { P_LOCAL_UPDATE_ITEM }  from '../../actions/positions/main';
import { P_UPDATE_ITEMS }       from '../../actions/positions/main';
import { P_DELETE_ITEMS }       from '../../actions/positions/main';

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

        case P_LOCAL_UPDATE_ITEM:
        {
            return localUpdateItem(state, action);
        }

        case P_UPDATE_ITEMS:
        {
            return updateItems(state, action);
        }

        case P_DELETE_ITEMS:
        {
            return deleteItems(state, action);
        }

        default:
        {
            return state;
        }
    }
}

const localUpdateItem = (items = [], action) => {
  return items.map( item => {
    if(item.guid === action.item.guid)
    {
      item = {...action.item};
    }
    return item;
  });
}

const updateItems = (items = [], action) => {
  let newItems      = items.map(item => item);
  let updatedItems  = action.items;

  let found         = false;

  console.log('updateItems(newItems)', newItems);
    
  updatedItems.map(updatedItem => {
    found = false;
    for(let i = 0; i < newItems.length; i++)
    {
      console.log('updateItems(newItems[i], updatedItem)', newItems[i], updatedItem);
      if(newItems[i].guid === updatedItem.guid)
      {
        newItems[i] = updatedItem;
        found = true;
        break;
      }
    }

    if(!found)
    {
      newItems.push(updatedItem);
    }
  });

  return newItems;
}


const deleteItems = (items = [], action) => {
    return items.map(item => {
        let needSaveItem = action.items.find(delItem => delItem.guid === item.guid) === undefined;
        if(!needSaveItem)
        {
            return null;
        }
        return item;
    }).filter(item => !!item);
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