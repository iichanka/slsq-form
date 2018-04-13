export const SC_SELECT_TAB  = 'SC_SELECT_TAB';

export const selectTab = (tabKey) => {
    return {
        type: SC_SELECT_TAB,
        key: tabKey
    }
}