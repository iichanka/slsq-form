import {
    SCH_REQUEST_ITEMS,
    SCH_RECEIVE_ITEMS,
    SCH_SELECT_CATEGORY,
  } from '../../../actions/search/criterias/hierarchy';
  
  import { SC_CLEAR }    from '../../../actions/search/criterias/main';
  
  const hierarchyInitState = {
    isLoading: false,
    items: [],
  }
  
  const onReceiveItems = (state = {}, action = {}) => {
    let oldItems = state.items || [];
    let newItems = action.items || [];
    let result = [];
    let lastID = oldItems.length;
    let checkedAndIndeterminate = false;
  
    result = oldItems.map(item => {
      if(item.id === action.itemID)
      {
        item.childsLoaded = true;
        checkedAndIndeterminate = item.selected && !item.indeterminate;
      }
      return item;
    });
  
    return {
      ...state,
      isLoading: false,
      items: result.concat(newItems.map(item => {
        if(checkedAndIndeterminate)
        {
          item.selected = true;
          item.indeterminate = item.haveChilds ? false : true;
        }
        else
        {
          item.selected       = false;
          item.indeterminate  = false;
        }

        item.id = lastID;
        item.parent = action.itemID;
        lastID ++;
        return item;
      }))
    }
    
  }
    
  
  const onRequestItems = (state ={}, action) => {
    return {
      ...state,
      isLoading: true
    }
  }

  const toggleItem = (items = [], selectedItemId) =>
  {
    return items.map( item => {
      if(item.id === selectedItemId)
      {
        item.selected       = !item.selected;
        item.indeterminate  = !item.selected;
      }
      return item;
    })
  }
  
  export const hierarchy = (state = hierarchyInitState, action) => {
    console.log("hierarchy[state]:", state);
    console.log("hierarchy[action]:", action);
    switch (action.type) {
      case SCH_REQUEST_ITEMS:
      {
        return onRequestItems(state, action);
      }
  
      case SCH_RECEIVE_ITEMS:
      {
        return onReceiveItems(state, action);
      }
  
      case SCH_SELECT_CATEGORY:
      {
        return {
          ...state,
          items: toggleItem(state.items, action.itemID)
        }
      }
  
      case SC_CLEAR:
      {
        return {
          ...state,
          selectedCategoryItemIDs: null,
        }
      }
  
      default:
      {
        return state;
      }
    }
  }

  