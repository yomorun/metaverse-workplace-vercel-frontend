import Link from 'next/link'
import cn from 'classnames'
import { useState, useEffect, useCallback } from 'react'

import { useRecoilValue, useRecoilState } from 'recoil'
import { onlineState, mutedState, locationState } from '../../store/atom'
import { onlineCountState } from '../../store/selector'

const signList = [
    'Use [W/A/S/D] control moving',
    'Click 🔇 button on the right to turn on sound',
    'Visit YoMo on Github',
    'Database is provided by Macrometa',
    'WebRTC is provided by Agora.io',
]

const Sidebar = () => {
    const [currentSign, setCurrentSign] = useState<number>(0)
    const [muted, setMutedState] = useRecoilState(mutedState)
    const online = useRecoilValue(onlineState)
    const count = useRecoilValue(onlineCountState)
    const location = useRecoilValue(locationState)

    useEffect(() => {
        const intervalId = setInterval(() => {
            setCurrentSign(index => (index === signList.length - 1 ? 0 : index + 1))
        }, 10000)

        return () => {
            clearInterval(intervalId)
        }
    }, [])

    const toggleMute = useCallback(() => {
        setMutedState(!muted)
    }, [muted])

    return (
        <div className='z-50 fixed top-2 right-4 flex items-center'>
            <div className='relative h-10 flex items-center sm:hidden'>
                <img className='absolute w-full h-full' src='./sidebar/dialogue.png' alt='' />
                <Link href='https://github.com/yomorun/yomo'>
                    <a
                        className='relative px-10 text-base text-center ym-text-blue hover:text-blue-600'
                        target='_blank'
                    >
                        {signList[currentSign]}
                    </a>
                </Link>
            </div>
            <div className='relative ml-4 h-10 flex justify-center items-center sm:hidden'>
                <img className='absolute h-full' src='./sidebar/dialogue.png' alt='' />
                <p className='relative px-6 text-base ym-text-blue'>
                    {location.country}-{location.region}
                </p>
            </div>
            <div className='relative ml-4 h-10 flex justify-center items-center'>
                <img className='absolute h-full' src='./sidebar/notice.png' alt='' />
                <p
                    className={cn('relative px-10 text-base', {
                        online: online,
                        offline: !online,
                    })}
                >
                    {online ? 'Online' : 'Offline'} {count}
                </p>
            </div>
            <div className='relative ml-4 w-10 h-10 flex justify-center items-center' id='mute-box'>
                <img className='absolute w-full h-full' src='./sidebar/bg-mute-button.png' alt='' />
                <button
                    className='relative h-3 flex justify-center items-center'
                    onClick={toggleMute}
                >
                    <img
                        className='relative w-full h-full'
                        src={`./sidebar/${muted ? 'mute' : 'volume'}.svg`}
                        alt=''
                    />
                </button>
            </div>
        </div>
    )
}

export default Sidebar
