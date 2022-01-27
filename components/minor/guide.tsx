import { useRecoilValue } from 'recoil'
import { smallDeviceState } from '../../store/atom'

const Guide = () => {
    const smallDevice = useRecoilValue(smallDeviceState)

    if (smallDevice) {
        return null
    }

    return (
        <div className='z-50 fixed bottom-5 left-1/2 transform -translate-x-1/2'>
            <img className='absolute' src='./bg-guide.png' alt='bg-guide' />
            <p className='relative px-10 py-2 text-base ym-text-yellow whitespace-nowrap'>
                <span>Build a</span>&nbsp;
                <a
                    className='ym-text-blue hover:opacity-80'
                    href='https://github.com/yomorun/yomo'
                    target='_blank'
                    rel='noreferrer'
                >
                    Geo-distributed architecture
                </a>
                &nbsp;
                <span>
                    Virtual HQ, use{' '}
                    <strong className='ym-text-blue'>
                        [W/A/S/D]
                    </strong>{' '}
                    to control movement.
                </span>
                &nbsp; (
                <a
                    className='ym-text-blue hover:opacity-80'
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
