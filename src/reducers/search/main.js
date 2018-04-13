import { criterias }        from './criterias/main';
import { results }          from './results/main';
import { S_START_SEARCH }   from '../../actions/search/main';
import { S_END_SEARCH }     from '../../actions/search/main';

const isSearching = (state = false, action) => {
    switch(action.type)
    {
        case S_START_SEARCH:
        {
            return true;
        }

        case S_END_SEARCH:
        {
            return false;
        }
        default:
        {
            return state;
        }
    }
}

const lastParameters = (state = {}, action) => {
    switch (action.type)
    {
        default:
        {
            return state;
        }
    }
}

export const search = (state = {}, action) => {
    console.log("search[state]:",  state);
    console.log("search[action]:", action);
    return {
        ...state,
        criterias:      criterias(state.criterias, action),
        results:        results(state.results, action),
        isSearching:    isSearching(state.isSearching, action),
        lastParameters: lastParameters(state.lastParameters, action),
    }
  }