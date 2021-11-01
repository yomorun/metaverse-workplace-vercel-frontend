import Link from 'next/link'
import cn from 'classnames'

const FloorLinks = ({ currentPath = '/' }) => {
    const data = [
        {
            id: '2',
            path: '/lectern',
        },
        {
            id: '1',
            path: '/',
        },
    ]

    return (
        <div className='z-50 fixed left-0 top-1/2 shadow-lg bg-white bg-opacity-80'>
            <div className='w-8 flex flex-col items-center text-base'>
                <svg
                    className='mt-2 fill-current text-black'
                    width='24'
                    height='24'
                    viewBox='0 0 1024 1024'
                    xmlns='http://www.w3.org/2000/svg'
                >
                    <path d='M896 85.333H704c-25.6 0-42.667 17.067-42.667 42.667v149.333H512c-25.6 0-42.667 17.067-42.667 42.667v149.333H320c-25.6 0-42.667 17.067-42.667 42.667v149.333H128c-25.6 0-42.667 17.067-42.667 42.667v192c0 25.6 17.067 42.667 42.667 42.667h768c25.6 0 42.667-17.067 42.667-42.667V128c0-25.6-17.067-42.667-42.667-42.667zm-768 358.4c25.6 0 42.667-17.066 42.667-42.666V307.2h106.666c25.6 0 42.667-17.067 42.667-42.667s-17.067-42.666-42.667-42.666H170.667v-51.2h106.666C302.933 170.667 320 153.6 320 128s-17.067-42.667-42.667-42.667H128c-25.6 0-42.667 17.067-42.667 42.667v273.067c0 21.333 17.067 42.666 42.667 42.666z' />
                </svg>
                {
                    data.map(item => (
                        <Link
                            href={item.path}
                            key={item.id}
                        >
                            <a
                                className={
                                    cn('w-8 h-8 text-center leading-8', {
                                        'bg-blue-600': currentPath === item.path,
                                        'text-white': currentPath === item.path,
                                        'hover:bg-white': currentPath !== item.path,
                                    })
                                }
                            >
                                {item.id}
                            </a>
                        </Link>
                    ))
                }
            </div>
        </div>
    )
}

export default FloorLinks
