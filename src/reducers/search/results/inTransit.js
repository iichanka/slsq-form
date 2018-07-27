import { S_RECEIVE_RESULTS }                        from '../../../actions/search/main';

export const inTransit = (state = [], action) => {
    switch (action.type)
    {
        case S_RECEIVE_RESULTS:
        {
            return action.results.intransit.map((record, index) => {
                record.itemType = 'IN_TRANSIT';
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