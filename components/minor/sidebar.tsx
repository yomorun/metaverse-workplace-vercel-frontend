import Link from 'next/link'
import cn from 'classnames'
import { useState, useEffect } from 'react'

import { useRecoilValue } from 'recoil'
import { onlineState, locationState } from '../../store/atom'
import { onlineCountState } from '../../store/selector'

const signList = [
    'Use [W/A/S/D] control moving',
    'Visit YoMo on Github',
    'Database is provided by Macrometa',
    'WebRTC is provided by Agora.io',
]

const Sidebar = () => {
    const [currentSign, setCurrentSign] = useState<number>(0)
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

    return (
        <div className='z-50 fixed top-6 left-0 w-full px-6 flex justify-between items-center sm:top-2 sm:px-2'>
            <div className='flex'>
                <div className='relative w-24 h-10 flex justify-center items-center'>
                    <img className='absolute w-full h-full' src='./bg-online.png' alt='bg-online' />
                    <img className='icon-sidebar' src='./icon-users.png' alt='icon-users' />
                    <div
                        className={cn('relative ml-2 w-2 h-2 rounded-full', {
                            'bg-online': online,
                            'bg-offline': !online,
                        })}
                    />
                    <p className='relative ml-2 text-base ym-text-yellow'>{count}</p>
                </div>
                <div className='relative ml-2 w-52 h-10 flex justify-center items-center'>
                    <img className='absolute h-full' src='./bg-location.png' alt='' />
                    <img className='icon-sidebar' src='./icon-modem.png' alt='icon-modem' />
                    <p className='relative ml-2 text-base ym-text-yellow'>
                        {location.country}-{location.region}
                    </p>
                </div>
            </div>
            <div className='relative h-10 flex items-center sm:hidden transition duration-500 ease-in-out transform-gpu hover:scale-110'>
                <img className='absolute w-full h-full' src='./bg-button.png' alt='' />
                <Link href='https://github.com/yomorun/yomo'>
                    <a
                        className='relative px-5 text-base text-center font-bold ym-text-dark'
                        target='_blank'
                    >
                        {signList[currentSign]}
                    </a>
                </Link>
            </div>
        </div>
    )
}

export default Sidebar
