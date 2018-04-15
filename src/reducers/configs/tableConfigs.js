import { C_RECEIVE_CONFIGS }        from '../../actions/configs/main';

const transformResultsColumns = columns => {
    let newColumns = [];
    
    columns.map((column, index) => {
        if(column.visible === 'true')
        {
            let column_ = {
                key:        index + '',
                title:      column.title,
                dataIndex:  column.dataIndex,
                sorter:     column.sortable === 'true',
            };

            if(column.width !== '')
            {
                newColumns.push({
                    ...column_,
                    width: column.width,
                });
            }
            else
            {
                newColumns.push({
                    ...column_,
                    width: 100,
                });
            }           
        }
    });

    return newColumns;
}


export const tableConfigs = (state = [], action) => {
    switch(action.type)
    {
        case C_RECEIVE_CONFIGS:
        {
            return action.configs.map(config => {
                switch(config.type)
                {
                    case 'RFR':
                    case 'RFIT':
                    case 'RFM':
                    {
                        return {
                            type:       config.type,
                            columns:    transformResultsColumns(config.columns),
                        }
                    }
                    
                    default:
                    {
                        return config;
                    }
                }
            })
        }

        default:
        {
            return state;
        }
    }
}