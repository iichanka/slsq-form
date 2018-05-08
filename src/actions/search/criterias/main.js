export const SC_SELECT_TAB  = 'SC_SELECT_TAB';
export const SC_CLEAR       = 'SC_CLEAR';

export const selectTab = (tabKey) => {
    return {
        type: SC_SELECT_TAB,
        key: tabKey
    }
}

export const clearCriterias = (tabKey = 'SBC' ) => {
    return {
        type: SC_CLEAR,
        key: tabKey,
    }
}