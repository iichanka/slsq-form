export const materials = (state = {}, action) => {

    console.log("searchByMaterials[state]",  state);
    console.log("searchByMaterials[action]:", action);

    switch (action.type)
    {
        case 'SBM_LIST_ATTRIBUTES':
        {
            return action.data;
        }
        case 'SBM_LIST_ATTRIBUTES_DEFAULT':
        {
            return [];
        }

        default:
        {
            return state;
        }
    }
}