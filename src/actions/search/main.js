import axios                    from 'axios';
import { showMessages }         from '../messages';

export const S_START_SEARCH  = 'S_START_SEARCH';
export const S_END_SEARCH    = 'S_END_SEARCH';

export const startSearch = () => {
    return {
        type: S_START_SEARCH,
    }
}

export const endSearch = () => {
    return {
        type: S_END_SEARCH,
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

export const search = () => (dispatch, getState) => {
    let currentState = getState();
    let request;
    let location = '';

    switch(currentState.search.criterias.activeTab)
    {
        case 'SBC':
        {
            request = getRequstForClassificator(currentState.search.criterias.classificator);
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
        dispatch(startSearch());
        
        axios.post(localStorage.getItem('AjaxURL'), {
              action:   'loadResults',              
              data:     {
                params:     request, 
                location:   location,
                type:       currentState.search.criterias.activeTab,
              }
            })
          .then(response => {
            let haveError = false;
            showMessages(response.data.messages, haveError);
           
            if(!haveError)
            {
                //dispatch(receiveItems(response.data.data));
                
            }
            dispatch(endSearch());
          })
          .catch(function (error) {
            showMessages([{type: 'E', text: 'Не удалось получить результаты поиска.'}]);
            dispatch(endSearch());
          });
    }
}