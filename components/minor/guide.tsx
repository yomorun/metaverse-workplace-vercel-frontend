import { useRecoilValue } from 'recoil'
import { smallDeviceState } from '../../store/atom'

const Guide = () => {
    const smallDevice = useRecoilValue(smallDeviceState)

    if (smallDevice) {
        return null
    }

    return (
        <div className='z-50 fixed bottom-10 left-1/2 transform -translate-x-1/2'>
            <img className='absolute' src='./dialogue.png' alt='dialogue' />
            <p className='relative mt-5 px-10 text-base ym-text-blue whitespace-nowrap'>
                <span>Build a</span>&nbsp;
                <a
                    className='text-blue-500 hover:text-blue-800'
                    href='https://github.com/yomorun/yomo'
                    target='_blank'
                    rel='noreferrer'
                >
                    Geo-distributed architecture
                </a>
                &nbsp;
                <span>
                    Virtual HQ, use{' '}
                    <strong className='bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-500'>
                        [W/A/S/D]
                    </strong>{' '}
                    to control movement.
                </span>
                &nbsp; (
                <a
                    className='text-blue-500 hover:text-blue-800'
                    href='https://github.com/yomorun/yomo-metaverse-workplace-nextjs'
                    target='_blank'
                    rel='noreferrer'
                >
                    Full Source Code can be found here
                </a>
                )
            </p>
        </div>
    )
}

export default Guide
