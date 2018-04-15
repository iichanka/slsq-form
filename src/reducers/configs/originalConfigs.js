import { C_RECEIVE_CONFIGS }        from '../../actions/configs/main';

export const originalConfigs = (state = [], action) => {
    switch(action.type)
    {
        case C_RECEIVE_CONFIGS:
        {
            return action.configs.map(config => {
                let newConfigColumns = config.columns.map((column, index) => {
                    column.key = index + '';
                    return column;
                })
                return {
                    type: config.type,
                    columns: newConfigColumns,
                }
            });
        }

        default:
        {
            return state;
        }
    }
}