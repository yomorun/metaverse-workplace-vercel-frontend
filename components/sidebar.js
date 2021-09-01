import Link from 'next/link'
import { useContext, useCallback, useState, useEffect } from 'react'
import { Context } from '../context'
import styles from './sidebar.module.css'

const signList = [
    'Use [W/A/S/D] control moving',
    'Click the button on the right to turn on the sound',
    'Follow YoMo'
]

export default function Sidebar({ onlineState, count }) {
    const [currentSign, setCurrentSign] = useState(0)

    useEffect(() => {
        const intervalID = setInterval(() => {
            setCurrentSign(index => {
                if (index === signList.length - 1) {
                    setCurrentSign(0)
                } else {
                    setCurrentSign(index + 1)
                }
            })
        }, 30000)

        return () => {
            clearInterval(intervalID)
        }
    }, [])

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
                <a target='_blank' alt='YoMo Github Repository'>{signList[currentSign]}</a>
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
