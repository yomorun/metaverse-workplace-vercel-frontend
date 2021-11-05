import Link from 'next/link'
import { useContext, useCallback, useState, useEffect } from 'react'
import cn from 'classnames'

import { Context } from '../context'

const signList = [
    'Use [W/A/S/D] control moving',
    'Click 🔇 button on the right to turn on sound',
    'Visit YoMo on Github',
    'Database is provided by Macrometa',
    'WebRTC is provided by Agora.io',
    'Build by Nextjs 12 and deployed on Vercel.com',
    'A Geo-distributed system all deployed on the edge'
]

export default function Sidebar({ onlineState, count, isMobile = false }) {
    const [currentSign, setCurrentSign] = useState(0)

    useEffect(() => {
        const timeoutID = setTimeout(() => {
            const muteBox = document.getElementById('mute-box')
            muteBox && muteBox.classList.remove('animate-pulse')
        }, 30000)

        let intervalID

        if (isMobile) {
            clearInterval(intervalID)
        } else {
            intervalID = setInterval(() => {
                setCurrentSign(index => {
                    if (index === signList.length - 1) {
                        setCurrentSign(0)
                    } else {
                        setCurrentSign(index + 1)
                    }
                })
            }, 10000)

            return () => {
                clearInterval(timeoutID)
                clearInterval(intervalID)
            }
        }
    }, [isMobile])

    const { state, dispatch } = useContext(Context)
    const { muted } = state.sound

    const toggleMute = useCallback(() => {
        dispatch({
            type: 'TOGGLE_MUTE',
            payload: !muted,
        })

        const muteBox = document.getElementById('mute-box')
        muteBox && muteBox.classList.remove('animate-pulse')
    }, [muted])

    return (
        <div className='z-50 fixed top-2 right-4 flex items-center'>
            {
                !isMobile && (
                    <div className='relative h-10 flex items-center'>
                        <img className='absolute w-full h-full' src='./sidebar/dialogue.png' alt='' />
                        <Link href='https://github.com/yomorun/yomo'>
                            <a className='relative px-10 text-base text-center ym-text-blue hover:text-blue-600' target='_blank' alt='YoMo Github Repository'>{signList[currentSign]}</a>
                        </Link>
                    </div>
                )
            }
            <div className='relative ml-4 h-10 flex justify-center items-center'>
                <img className='absolute w-28 h-full' src='./sidebar/notice.png' alt='' />
                <p
                    className={cn('relative px-6 text-base', {
                        'online': onlineState,
                        'offline': !onlineState
                    })}
                >
                    {onlineState ? 'Online' : 'Offline'} {count}
                </p>
            </div>
            <div className='relative ml-4 w-10 h-10 flex justify-center items-center animate-pulse' id='mute-box'>
                <img className='absolute w-full h-full' src='./sidebar/bg-mute-button.png' alt='' />
                <button className='relative h-3 flex justify-center items-center' onClick={toggleMute}>
                    <img className='relative w-full h-full' src={`./sidebar/${muted ? 'mute' : 'volume'}.svg`} alt='' />
                </button>
            </div>
        </div>
    )
}
