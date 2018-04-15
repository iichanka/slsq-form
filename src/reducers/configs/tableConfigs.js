import { C_RECEIVE_CONFIGS }        from '../../actions/configs/main';

export const tableConfigs = (state = [], action) => {
    switch(action.type)
    {
        case C_RECEIVE_CONFIGS:
        {
            let configs = action.configs.map(config => {
                let newConfigColumns = config.columns.map((column, index) => {

                    column.key          = index + '';                    
                    column.searchable   = column.searchable === 'true';
                    column.sortable     = column.sortable === 'true';
                    column.visible      = column.visible === 'true';                    
                    column.editable     = column.editable === 'true';
                    column.width        = parseInt(column.width, 10);
                    return column;
                })

                let config_type = config.type;
                return {
                    type: config_type,
                    columns: newConfigColumns,
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