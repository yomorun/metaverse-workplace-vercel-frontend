import Link from 'next/link'
import { useContext, useCallback } from 'react'
import { Context } from '../context'
import styles from './sidebar.module.css'

export default function Sidebar({ onlineState, count }) {
    const { state, dispatch } = useContext(Context)
    const { muted } = state.sound

    const toggleMute = useCallback(() => {
        dispatch({
            type: 'TOGGLE_MUTE',
            payload: !muted,
        })
    }, [muted])

    return (
        <nav className={styles.nav}>
            <Link href='https://github.com/yomorun/yomo' >
                <a target='_blank' alt='YoMo Github Repository'>Use [W/A/S/D] control moving</a>
            </Link>
            <p>
                <span className={onlineState ? styles.online : styles.offline}>{onlineState ? 'Online' : 'Offline'}</span>&nbsp;&nbsp;
                <span>{count}</span>
            </p>
            <button onClick={toggleMute}>
                {muted ? '🔇' : '🔉'}
            </button>
        </nav>
    )
}
