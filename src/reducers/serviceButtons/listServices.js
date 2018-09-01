export const listServices = (state = [], action) => {
    
    console.log("listServicesState[state]",  state);
    console.log("listServicesState[action]:", action);
    switch(action.type)
    {
        case 'S_LIST_SERVICES':
        {
            return action.data;
        }
        case 'S_LIST_SERVICES_DEFAULT':
        {
            return [];
        }

        default:
        {
            return state;
        }
    }
    
}