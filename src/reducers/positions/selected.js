export const selectedPosition = (state = [], action) => {
    
    console.log("selectedPosition[state]",  state);
    console.log("selectedPosition[action]:", action);
    switch(action.type)
    {
        case 'P_SELECTED_POSITIONS':
        {
            return action.data;
        }
        case 'P_SELECTED_POSITIONS_DEFAULT':
        {

            return [];
        }

        default:
        {
            return state;
        }
    }
    
}