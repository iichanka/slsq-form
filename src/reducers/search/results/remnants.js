import { S_RECEIVE_RESULTS }                        from '../../../actions/search/main'

export const remnants = (state = [], action) => {
    switch (action.type)
    {
        case S_RECEIVE_RESULTS:
        {
            return action.results.remnants.map((record, index) => {
                record.itemType = 'REMNANTS';
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