import { S_RECEIVE_RESULTS }                        from '../../../actions/search/main';

export const materials = (state = [], action) => {
    switch (action.type)
    {
        case S_RECEIVE_RESULTS:
        {
            return action.results.rfm.map((record, index) => {
                record.itemType = 'RFM';
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