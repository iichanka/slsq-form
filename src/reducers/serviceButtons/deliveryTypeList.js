export const deliveryTypeList = (state = [], action) => {
    
    console.log("deliveryTypeListState[state]",  state);
    console.log("deliveryTypeListState[action]:", action);
    switch(action.type)
    {
        case 'D_DELIVERY_TYPE':
        {
            return action.data;
        }
        case 'D_DELIVERY_TYPE_DEFAULT':
        {
            return [];
        }

        default:
        {
            return state;
        }
    }
    
}