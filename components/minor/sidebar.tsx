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
        </div>
    )
}

export default Sidebar
