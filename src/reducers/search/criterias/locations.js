import { SCL_REQUEST_ITEMS,
         SCL_RECEIVE_ITEMS,
         SCL_SELECT_ITEM } from '../../../actions/search/criterias/locations';

const locationsInitState = {
    isLoading: false,
    items: [],
}

export const locations = (state = locationsInitState, action) => {
    switch (action.type)
    {
        case SCL_REQUEST_ITEMS:
        {
            return {
                ...state,
                isLoading: true,
                items: []
            }
        }

        case SCL_RECEIVE_ITEMS:
        {
            return {
                ...state,
                isLoading: false,
                items: action.items.map((item, index) => {
                    index === 0 ? item.selected = true: {};
                    item.id = index;
                    return item;
                })
            }
        }

        case SCL_SELECT_ITEM:
        {
            return {
                ...state,
                items: state.items.map((item, index) => {
                    index === action.itemID ? item.selected = true : item.selected = false;
                    return item;
                })
            }
        }
        default:
        {
            return state;
        }
    }
}