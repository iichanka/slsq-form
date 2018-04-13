import {
  SCC_REQUEST_ITEMS,
  SCC_RECEIVE_ITEMS,
  SCC_TOGGLE_ITEM,
  SCC_SELECT_ITEMS,
  SCC_SELECT_CLASS
} from '../../../actions/search/criterias/classificator';


const classificatorInitState = {
  isLoading: false,
  selectedClassItemID: -2, //value that can't exist as parent ID in item
  items: [],
}

const onReceiveItems = (oldItems = [], newItems = [], itemID = -1) => {
  let lastID = oldItems.length;
  let result = [];

  result = oldItems.map(item => {
    if(item.id === itemID)
    {
      item.childsLoaded = true;
    }
    return item;
  });

  return result.concat(newItems.map(item => {
    item.id = lastID;
    item.parent = itemID;
    lastID ++;
    return item;
  }));
}

const onToggleItem = (state = {}, action) => {
  switch(action.type)
  {
    case SCC_TOGGLE_ITEM:
    {
      let items = state.map(item => {
        if (item.id === action.itemID)
        {
          item.selected = !item.selected;
        }
        return item;
      });
      return items;
    }
    default:
    {
      return state;
    }
  }
}

const onSelectItems = (state = {}, action) => {
  switch (action.type) {
    case SCC_SELECT_ITEMS:
    {
      return state.map(item => {
        if(action.itemsIDs.indexOf(item.id) !== -1)
        {
          item.selected = action.mode;
        }

        return item;
      });
    }
    default: 
    {
      return state;
    }
  }
}

const onRequestItems = (state ={}, action) => {
  switch(action.type)
  {
    case SCC_REQUEST_ITEMS:
    {
      return {
        ...state,
        isLoading: true
      }
    }
      
    default:
    {
      return state;
    }

  }
}

export const classificator = (state = classificatorInitState, action) => {
  console.log("classificator[state]:", state);
  console.log("classificator[action]:", action);
  switch (action.type) {
    case SCC_REQUEST_ITEMS:
    {
      return {
        ...state,
        ...onRequestItems(state, action)
      }
    }

    case SCC_RECEIVE_ITEMS:
    {
      return {
        ...state,
        isLoading: false,
        items: onReceiveItems(state.items, action.items, action.itemID)
      };
    }

    case SCC_TOGGLE_ITEM:
    {
      return {
        ...state,
        items: onToggleItem(state.items, action)
      }
    }

    case SCC_SELECT_ITEMS:
    {
      return {
        ...state,
        items: onSelectItems(state.items, action)
      }
    }


    case SCC_SELECT_CLASS:
    {
      return {
        ...state,
        selectedClassItemID: action.itemID
      }
    }

    default:
    {
      return state;
    }
  }
}
