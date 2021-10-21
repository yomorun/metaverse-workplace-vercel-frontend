import { useEffect, memo } from 'react'

const DefaultText = () => (
    <>
        <span>Build a</span>&nbsp;
        <a
            className='hover:text-blue-600'
            href='https://github.com/yomorun/yomo'
            target='_blank'
            rel='noreferrer'
        >
            Geo-distributed architecture
        </a>&nbsp;
        <span>Virtual HQ, use <strong className='bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-500'>[W/A/S/D]</strong> to control movement.</span>&nbsp;
        (<a
            className='hover:text-blue-600'
            href='https://github.com/yomorun/yomo-metaverse-workplace-nextjs'
            target='_blank'
            rel='noreferrer'
        >
            Full Source Code can be found here
        </a>)
    </>
)

const Guide = ({ guideText }) => {
    useEffect(() => {
        const timeoutID = setTimeout(() => {
            const guideBox = document.getElementById('guide-box')
            guideBox && guideBox.classList.add('hidden')
        }, 15000)

        return () => {
            clearInterval(timeoutID)
        }
    }, [])

    return  (
        <div className='absolute bottom-2 left-1/2 transform -translate-x-1/2 flex justify-center items-center' id='guide-box'>
            <img className='absolute' src='./dialogue.png' alt='dialogue' />
            <p className=' relative px-10 text-base ym-text-blue whitespace-nowrap'>
                {guideText ? guideText : <DefaultText />}
            </p>
        </div>
    )
}

function areEqual(prevProps, nextProps) {
    return prevProps.guideText === nextProps.guideText
}

export default memo(Guide, areEqual)
