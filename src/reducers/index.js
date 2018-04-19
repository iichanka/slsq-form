import { header }                     from './header/main';
import { positions }                  from './positions/main';
import { search }                     from './search/main';
import { configs }                    from './configs/main';
import { F_LOAD_EDITABLE_STATUS }     from '../actions/isEditable';
import { F_RECEIVE_EDITABLE_STATUS }  from '../actions/isEditable';
import { F_END_LOAD_EDITABLE_STATUS } from '../actions/isEditable';

const isEditable = (state = false, action) => {
  console.log('rootReducer.isEditable[action]:', action);
  switch(action.type)
  {
    case F_RECEIVE_EDITABLE_STATUS:
    {
      
      return action.isEditable === 'true';
    }

    default:
    {
      return state;
    }
  }
}


const rootReducer = (state = {}, action) => {
  return {
    header:     header(state.header, action),
    positions:  positions(state.positions, action),
    search:     search(state.search, action),
    configs:    configs(state.configs, action),
    isEditable: isEditable(state.isEditable, action),
  }
};

export default rootReducer
