import { header }     from './header/main';
import { positions }  from './positions/main';
import { search }     from './search/main';
import { configs }    from './configs/main';

const rootReducer = (state = {}, action) => {
  return {
    header:     header(state.header, action),
    positions:  positions(state.positions, action),
    search:     search(state.search, action),
    configs:    configs(state.configs, action),
  }
};

export default rootReducer
