import { S_START_SEARCH }               from '../../../actions/search/main';

export const remnants = (state = {}, action) => {
    switch (action.type)
    {
        case S_START_SEARCH:
        {
            //проверка что конфиг загружен
        }

        default:
        {
            return state;
        }
    }
}