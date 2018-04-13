import axios from 'axios';
import { showMessages } from '../../messages';

export const SCC_REQUEST_ITEMS  = 'SCC_REQUEST_ITEMS';
export const SCC_RECEIVE_ITEMS  = 'SCC_RECEIVE_ITEMS';
export const SCC_TOGGLE_ITEM    = 'SCC_TOGGLE_ITEM';
export const SCC_SELECT_ITEMS   = 'SCC_SELECT_ITEMS';
export const SCC_SELECT_CLASS   = 'SCC_SELECT_CLASS';

export const requestClassificatorItems = itemID => ({
  type: SCC_REQUEST_ITEMS,
  itemID
})

export const selectClass = itemID => ({
  type: SCC_SELECT_CLASS,
  itemID
})

export const receiveClassificatorItems = (itemID, data, isAttributes = false) => {
  return ({
    type: SCC_RECEIVE_ITEMS,
    itemID,
    items: data,
    isAttributes: isAttributes
  });
}

export const toggleClassificatorItem = itemID => ({
  type: SCC_TOGGLE_ITEM,
  itemID
})

export const selectClassificatorItems = (itemsIDs, mode) => ({
  type: SCC_SELECT_ITEMS,
  itemsIDs,
  mode
})

const loadClassificatorItems = (state = {}, itemID) => dispatch => {
  dispatch(requestClassificatorItems(itemID));
  let key = '';
  let val = '';
  if(state.items)
  {
    state.items.find(item => {
      if(item.id === itemID)
      {
        key = item.key_name;
        val = item.key_value;
        return true;
      }
    });
  }

  axios.get(localStorage.getItem('AjaxURL'), {
    params: {
      action: "searchCriteriasLoad",
      type : "SBC",
      key_name: key,
      key_value: val
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
        dispatch(receiveClassificatorItems(itemID, response.data.data || [], response.data.is_attributes));
    }
  })
  .catch(function (error) {
    showMessages([{type: 'E', text: 'Не удалось получить критерии поиска.'}]);
    dispatch(receiveClassificatorItems(itemID, []));
  });
}

const shouldLoadClassificatorItems = (state = {}, itemID) => {
  if(state.items === undefined)
  {
    return true;
  }
  const item  = state.items.find(item => item.id == itemID);

  if(item)
  {
    return !item.childsLoaded;
  }
  return true;
}

export const loadItemsIfNeeded = itemID => (dispatch, getState) => {
  if (shouldLoadClassificatorItems(getState().search.criterias.classificator, itemID)) {
    return dispatch(loadClassificatorItems(getState().search.criterias.classificator, itemID));
  }
}
