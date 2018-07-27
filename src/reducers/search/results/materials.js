import { S_RECEIVE_RESULTS }                        from '../../../actions/search/main';

export const materials = (state = [], action) => {
    switch (action.type)
    {
        case S_RECEIVE_RESULTS:
        {
            return action.results.materials.map((record, index) => {
                record.itemType = 'MATERIALS';
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