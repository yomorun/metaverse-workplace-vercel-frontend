import { memo } from 'react'

const Guide = () => {
    return (
        <div className='z-10 fixed bottom-10 left-1/2 transform -translate-x-1/2 bg-white rounded-md shadow-lg'>
            <p className=' py-2 px-5 text-sm text-gray-900'>
                <span>Build a</span>&nbsp;
                <a
                    className='text-blue-900 hover-text-gray'
                    href='https://github.com/yomorun/yomo'
                    target='_blank'
                    rel='noreferrer'
                >
                    Edge-Mesh-Arch
                </a>&nbsp;
                <span>online office, use [W/A/S/D] to control movement.</span>&nbsp;
                (<a
                    className='text-blue-900 hover-text-gray'
                    href='https://github.com/yomorun/yomo-vhq-nextjs'
                    target='_blank'
                    rel='noreferrer'
                >
                    Full Source Code can be found here
                </a>)
            </p>
        </div>
    )
}

export default memo(Guide, () => true)
