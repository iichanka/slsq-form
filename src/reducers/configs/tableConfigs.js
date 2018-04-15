import { C_RECEIVE_CONFIGS }        from '../../actions/configs/main';

const addActionColumn = config => {
    return config;
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
                        return addActionColumn(config);
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