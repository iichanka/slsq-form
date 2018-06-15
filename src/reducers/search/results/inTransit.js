import { S_RECEIVE_RESULTS }                        from '../../../actions/search/main';

export const inTransit = (state = [], action) => {
    switch (action.type)
    {
        case S_RECEIVE_RESULTS:
        {
            return action.results.rfit.map((record, index) => {
                record.itemType = 'RFIT';
                record.key      = index.toString();
                return record;
            });
        }

        default:
        {
            return state;
        }
    }
}