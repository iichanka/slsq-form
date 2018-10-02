import axios                    from 'axios';
import { showMessages }         from '../messages';

export const S_START_SEARCH     = 'S_START_SEARCH';
export const S_END_SEARCH       = 'S_END_SEARCH';
export const S_RECEIVE_RESULTS  = 'S_RECEIVE_RESULTS';

export const startSearch = (parameters) => {
    return {
        type: S_START_SEARCH,
        parameters: parameters,
    }
}

export const endSearch = () => {
    return {
        type: S_END_SEARCH,
    }
}

export const receiveResults = (data) => {
    return {
        type: S_RECEIVE_RESULTS,
        results: data,
    }
}


const getRequstForClassificator = (state = {}) => {
    let group_ = '';
    let class_ = '';
    let attrs_ = [];
   
    state.items.find( item => {
        if(item.id === state.selectedClassItemID)
        {
            class_ = item.key_value;

            state.items.find( groupItem => {
                if(groupItem.id === item.parent)
                {
                    group_ = groupItem.key_value;
                    return true;
                }
            });

            state.items.map( attr => {
                if(attr.parent === item.id && attr.selected === true)
                {
                    attrs_.push({
                        group: attr.group_id,
                        value: attr.key_value,
                    });
                }
            })

            return true;
        }
    });

    return {
        group: group_,
        class: class_,
        attrs: attrs_,
    }
}


const getRequstForHierarchy = (state = { items: []}) => {
    const { items } = state;

    console.log('getRequstForHierarchy(state)', state);

    if(items)
    {
        return {
            categories: items.map( item => { return item.selected ? item.guid : null; } ).filter(item => !!item)
        } 
    }
}


const loadResults = (parameters = {}) => (dispatch, getState) =>{
    dispatch(startSearch(parameters));

    axios.post(
        localStorage.getItem('AjaxURL'), 
        {
          action:   'loadResults',              
          data:     parameters,
        },
    )
      .then(response => {
        let haveError = false;
        showMessages(response.data.messages, haveError);
       
        if(!haveError)
        {
            dispatch(receiveResults(response.data));
            
        }
        dispatch(endSearch());
      })
      .catch(function (error) {
        console.log('loadResults[error]:', error);
        showMessages([{type: 'E', text: 'Не удалось получить результаты поиска.' + error.message}]);
        dispatch(endSearch());
      });
}


export const search = (lastParameters = false) => (dispatch, getState) => {
    if(lastParameters)
    {
        dispatch(loadResults(lastParameters));
        return;
    }

    let currentState = getState();
    let request;
    let location = '';

    console.log('active tab',currentState.search.criterias.activeTab);
    switch(currentState.search.criterias.activeTab)
    {
        case 'SBC':
        {
            request = getRequstForClassificator(currentState.search.criterias.classificator);
            break;
        }

        case 'SBH':
        {
            request = getRequstForHierarchy(currentState.search.criterias.hierarchy);
            break;
        }

        case 'SBM':
        {
            request = currentState.search.criterias.materials;
            break;
        }
    }

    currentState.search.criterias.locations.items.find( loc => {
        if(loc.selected === true )
        {
            location = loc.key_value;
            return true;
        }
    });


    if(request)
    {
        dispatch(loadResults({
            params:     request, 
            location:   location,
            type:       currentState.search.criterias.activeTab,
        }))
    }
}