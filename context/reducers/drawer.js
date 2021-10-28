export function drawer(state, action) {
    switch (action.type) {
        case 'OPEN_DRAWER':
            return {
                ...state,
                drawer: {
                    ...state.drawer,
                    ...action.payload,
                    isOpen: true,
                }
            }
        case 'CLOSE_DRAWER':
            return {
                ...state,
                drawer: {
                    isOpen: false,
                    iframeSrc: '',
                    imgList: [],
                }
            }
        default:
            return state
    }
}
