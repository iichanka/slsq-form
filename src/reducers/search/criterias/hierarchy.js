import {
    SCH_REQUEST_ITEMS,
    SCH_RECEIVE_ITEMS,
    SCH_SELECT_CATEGORY,
  } from '../../../actions/search/criterias/hierarchy';
  
  import { SC_CLEAR }    from '../../../actions/search/criterias/main';
  
  const hierarchyInitState = {
    isLoading: false,
    selectedCategoryItemID: -2, //value that can't exist as parent ID in item
    items: [],
  }
  
  const onReceiveItems = (state = {}, action = {}) => {
    let oldItems = state.items || [];
    let newItems = action.items || [];
    let result = [];
    let lastID = oldItems.length;
  
    result = oldItems.map(item => {
      if(item.id === action.itemID)
      {
        item.childsLoaded = true;
      }
      return item;
    });
  
    return {
      ...state,
      isLoading: false,
      items: result.concat(newItems.map(item => {
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
          selectedCategoryItemID: action.itemID
        }
      }
  
      case SC_CLEAR:
      {
        return {
          ...state,
          selectedCategoryItemID: null,
        }
      }
  
      default:
      {
        return state;
      }
    }
  }
  