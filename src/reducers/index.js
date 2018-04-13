import { header }     from './header/main';
import { positions }  from './positions/main';
import { search }     from './search/main';

const rootReducer = (state = {}, action) => {
  return {
    header:     header(state.header, action),
    positions:  positions(state.positions, action),
    search:     search(state.search, action),
  }
};

export default rootReducer
