import { header }                     from './header/main';
import { positions }                  from './positions/main';
import { selectedPosition }           from './positions/selected';
import { search }                     from './search/main';
import { configs }                    from './configs/main';
import { F_RECEIVE_EDITABLE_STATUS }  from '../actions/isEditable';
import { serviceButtonsState }        from './serviceButtons/main';
import { listServices }               from './serviceButtons/listServices';
import { deliveryTypeList }           from './serviceButtons/deliveryTypeList';

const isEditable = (state = false, action) => {
  console.log('rootReducer.isEditable[action][state]:', action, state);
  switch(action.type)
  {
    case F_RECEIVE_EDITABLE_STATUS:
    {
      if(typeof action.isEditable === 'string')
      {
        return action.isEditable === 'true' ? true : false;
      }
      return action.isEditable;
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
    serviceButtonsState:  serviceButtonsState(state.serviceButtonsState, action),
    search:     search(state.search, action),
    configs:    configs(state.configs, action),
    isEditable: isEditable(state.isEditable, action),
    selectedPosition: selectedPosition(state.selectedPosition, action),
    listServices: listServices(state.listServices, action),
    deliveryTypeList: deliveryTypeList(state.deliveryTypeList, action),
  }
};

export default rootReducer
