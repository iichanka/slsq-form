import { classificator }    from './classificator';
import { hierarchy }        from './hierarchy';
import { materials }        from './materials';
import { locations }        from './locations';
import { SC_SELECT_TAB }    from '../../../actions/search/criterias/main';


const activeTab = (state = 'SBC', action) => {
    switch(action.type)
    {
        case SC_SELECT_TAB:
        {
            return action.key;
        }
        default:
        {
            return state;
        }
    }
}

export const criterias = (state = {}, action) => {
    console.log("search.criterias[state]:",  state);
    console.log("search.criterias[action]:", action);
    return {
        ...state,
        classificator:  classificator(state.classificator, action),
        hierarchy:      hierarchy(state.hierarchy, action),
        materials:      materials(state.materials, action),
        locations:      locations(state.locations, action),
        activeTab:      activeTab(state.activeTab, action),
    }
  }