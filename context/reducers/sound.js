export function sound(state, action) {
    switch (action.type) {
        case 'TOGGLE_MUTE':
            return { ...state, sound: { muted: action.payload } }
        default:
            return state
    }
}
