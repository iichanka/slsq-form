import { C_RECEIVE_CONFIGS }        from '../../actions/configs/main';

export const tableConfigs = (state = [], action) => {
    switch(action.type)
    {
        case C_RECEIVE_CONFIGS:
        {
            let configs = action.configs.map(config => {
                let newConfigColumns = config.columns.map((column, index) => {
                    column.key          = index.toString();
                    column.dataIndex    = column.data_index;
                    /* column.searchable   = column.searchable === 'true';
                    column.sortable     = column.sortable === 'true';
                    column.visible      = column.visible === 'true';                    
                    column.editable     = column.editable === 'true';
                    column.technical    = column.technical === 'true'; */
                    return column;
                })

                let configType      = config.type;
                let configPageSize  = config.pageSize;
                let default_        = config.default;
                return {
                    type: configType,
                    columns: newConfigColumns,
                    pageSize: configPageSize,
                    default: default_,
                }
            });

            console.log('tableConfigs[result]', configs);
            return configs;
        }

        default:
        {
            return state;
        }
    }
}