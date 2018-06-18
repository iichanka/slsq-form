import { S_RECEIVE_RESULTS }                        from '../../../actions/search/main'

export const remnants = (state = [], action) => {
    switch (action.type)
    {
        case S_RECEIVE_RESULTS:
        {
            return action.results.rfr.map((record, index) => {
                record.itemType = 'RFR';
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