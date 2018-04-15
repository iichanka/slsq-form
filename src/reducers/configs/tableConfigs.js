import { C_RECEIVE_CONFIGS }        from '../../actions/configs/main';

export const tableConfigs = (state = [], action) => {
    switch(action.type)
    {
        case C_RECEIVE_CONFIGS:
        {
            return action.configs.map(config => {
                let newConfigColumns = config.columns.map((column, index) => {
                    column.key = index + '';
                    
                    if(column.sortable === 'true')
                    {
                        column.sortable = true;
                    }
                    else 
                    {
                        column.sortable = false;
                    }

                    if(column.editable === 'true')
                    {
                        column.editable = true;
                    }
                    else 
                    {
                        column.editable = false;
                    }

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