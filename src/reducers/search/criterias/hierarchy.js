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
        checkedAndIndeterminate = item.selected;
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

  /* selectParentsIfNeeded( items = [], itemID = -1, selected )
  {
    let parent      = items.find( item => item.id === itemID );
    let otherChilds = [];

    if(parent)
    {
      if(selected)
      {
        otherChilds = items.filter( item => item.id !== itemID && item.parent === parent.id );
    
        if(otherChilds.size > 0)
        {
          let notSelectedItem = otherChilds.find( item => !item.selected )
          if(!notSelectedItem)
          {
            parent.selected = true;
          }
        }
      }
      else
      {
        parent.selected = false;
      }
      selectParentsIfNeeded(items, parent.id, select)
    }

    

    if(parents.size > 0)
    {

    }
  } */

  const toggleItem = (items = [], selectedItemId) =>
  {
    return items.map( item => {
      if(item.id === selectedItemId)
      {
        item.selected       = !item.selected;
        item.indeterminate  = !item.selected;
        if(item.haveChilds && item.selected)
        {
          
        }
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

  