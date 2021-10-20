import { memo } from 'react'

const Guide = () => {
    return (
        <div className='z-10 fixed bottom-10 left-1/2 transform -translate-x-1/2 bg-white rounded-md shadow-lg sm:hidden'>
            <p className='py-2 px-5 text-sm text-gray-900'>
                <span>Build a</span>&nbsp;
                <a
                    className='text-blue-500 hover:text-blue-900'
                    href='https://github.com/yomorun/yomo'
                    target='_blank'
                    rel='noreferrer'
                >
                    Geo-distributed architecture
                </a>&nbsp;
                <span>Virtual HQ, use <strong className='bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-500'>[W/A/S/D]</strong> to control movement.</span>&nbsp;
                (Source Code: <a
                    className='text-blue-500 hover:text-blue-900'
                    href='https://github.com/yomorun/yomo-metaverse-workplace-nextjs'
                    target='_blank'
                    rel='noreferrer'
                >
                    Frontend
                </a>&nbsp;<a
                    className='text-blue-500 hover:text-blue-900'
                    href='https://github.com/yomorun/yomo-vhq-backend'
                    target='_blank'
                    rel='noreferrer'
                > Backend </a>)
            </p>
        </div>
    )
}

export default memo(Guide, () => true)
