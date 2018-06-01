import axios                from 'axios';
import { showMessages }     from '../../messages';

export const SCH_REQUEST_ITEMS      = 'SCH_REQUEST_ITEMS';
export const SCH_RECEIVE_ITEMS      = 'SCH_RECEIVE_ITEMS';
export const SCH_SELECT_CATEGORY    = 'SCH_SELECT_CATEGORY';

export const requestHierarchyItems = itemID => ({
  type: SCH_REQUEST_ITEMS,
  itemID
})

export const selectCategory = itemID => ({
  type: SCH_SELECT_CATEGORY,
  itemID
})

export const receiveHierarchyItems = (itemID, data = []) => {
  return ({
    type: SCH_RECEIVE_ITEMS,
    itemID,
    items: data,
  });
}

const loadHierarchyItems = (state = {}, itemID) => dispatch => {
  dispatch(requestHierarchyItems(itemID));
  
  let guid = '';

  if(state.items)
  {
    state.items.find(item => {
      if(item.id === itemID)
      {
        guid = item.guid;
        return true;
      }
    });
  }

  axios.get(localStorage.getItem('AjaxURL'), {
    params: {
      action: "getHierarchy",
      guid
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
        dispatch(receiveHierarchyItems(itemID, response.data.data));
    }
  })
  .catch(function (error) {
    showMessages([{type: 'E', text: 'Не удалось получить категории иерархии продуктов.'}]);
    dispatch(receiveHierarchyItems(itemID));
  });
}

const shouldLoadHierarchyItems = (state = {}, itemID) => {
  if(state.items === undefined)
  {
    return true;
  }
  const item  = state.items.find(item => item.id == itemID);

  if(item)
  {
    return item.haveChilds && !item.childsLoaded;
  }
  return true;
}

export const loadItemsIfNeeded = itemID => (dispatch, getState) => {
  if (shouldLoadHierarchyItems(getState().search.criterias.hierarchy, itemID)) {
    return dispatch(loadHierarchyItems(getState().search.criterias.hierarchy, itemID));
  }
}
