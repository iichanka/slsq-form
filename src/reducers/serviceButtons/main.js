// состояние кнопок по умолчанию
const serviceButtonsDefault = {service: false, delivery: true};

export const serviceButtonsState = (state = serviceButtonsDefault, action) => {
    
    console.log("serviceButtonsState[state]",  state);
    console.log("serviceButtonsState[action]:", action);
    switch(action.type)
    {
        case 'P_CHECK_BUTTONS':
        {

            return action.availability;
        }
        case 'P_CHECK_BUTTONS_DEFAULT':
        {

            return serviceButtonsDefault;
        }

        default:
        {
            return state;
        }
    }
    
}