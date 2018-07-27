import { remnants }         from './remnants';
import { inTransit }        from './inTransit';
import { materials }        from './materials';
import { SR_SELECT_TAB }    from '../../../actions/search/results/main';


const activeTab = (state = 'REMNANTS', action) => {
    switch(action.type)
    {
        case SR_SELECT_TAB:
        {
            return action.key;
        }
        default:
        {
            return state;
        }
    }
}
export const results = (state = {}, action) => {
    console.log("search.results[state]:",  state);
    console.log("search.results[action]:", action);
    return {
        ...state,
        remnants:       remnants(state.remnants, action),
        inTransit:      inTransit(state.inTransit, action),
        materials:      materials(state.materials, action),
        activeTab:      activeTab(state.activeTab, action),
    }
  }