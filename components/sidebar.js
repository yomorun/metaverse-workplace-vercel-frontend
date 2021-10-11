import Link from 'next/link'
import { useContext, useCallback, useState, useEffect } from 'react'
import { Context } from '../context'
import styles from './sidebar.module.css'

const signList = [
    'Use [W/A/S/D] control moving',
    'Click 🔇 button on the right to turn on sound',
    'Visit YoMo on Github',
    'Database is provided by Macrometa',
    'WebRTC is provided by Agora.io'
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
        }, 10000)

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
            <Link href='https://github.com/yomorun/yomo'>
                <a className='sm:hidden' target='_blank' alt='YoMo Github Repository'>{signList[currentSign]}</a>
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
