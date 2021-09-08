import { useState, useEffect, memo } from 'react'
import { Observable } from 'rxjs'
import { debounceTime } from 'rxjs/operators'
import { checkCircularCollision } from '../libs/lib'

const EnterArea = ({ sock, elementIdPrefix, hostId }) => {
    const [showCircularAreaIframe, setShowCircularAreaIframe] = useState(false)
    const [showSemicircleAreaIframe, setShowSemicircleAreaIframe] = useState(false)

    useEffect(() => {
        const movement$ = new Observable(obs => {
            sock.on('movement', mv => {
                if (mv.name === hostId) {
                    obs.next(mv)
                }
            })
        })

        const subscription = movement$.pipe(debounceTime(500)).subscribe(() => {
            const hostBox = document.getElementById(elementIdPrefix + hostId)
            const circularArea = document.getElementById('middle-circular-area')
            if (hostBox && circularArea) {
                const collided = checkCircularCollision(hostBox, circularArea)
                setShowCircularAreaIframe(collided)

                if (!collided) {
                    const semicircleArea = document.getElementById('left-semicircle-area')
                    if (semicircleArea) {
                        const collided = checkCircularCollision(hostBox, semicircleArea)
                        setShowSemicircleAreaIframe(collided)
                    }
                }
            }
        })

        return () => {
            subscription.unsubscribe()
        }
    }, [])

    return (
        <>
            <div
                id='middle-circular-area'
                className='fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40
                flex justify-center items-center bg-blue-600 bg-opacity-30 border-4 rounded-full border-blue-600 border-dotted'
            >
                <span className='text-white font-bold'>YoMo</span>
            </div>
            {
                showCircularAreaIframe && (
                    <iframe
                        className='z-50 fixed top-1/2 left-1/2 transform translate-x-32 -translate-y-1/2'
                        title='YoMo'
                        width='800'
                        height='400'
                        src='https://yomo.run'
                    >
                    </iframe>
                )
            }
            <div
                id='left-semicircle-area'
                className='fixed top-1/2 left-0 transform -translate-x-1/2 -translate-y-full w-40 h-40
                bg-blue-600 bg-opacity-30 border-4 rounded-full border-blue-600 border-dotted'
            >
            </div>
            {
                showSemicircleAreaIframe && (
                    <iframe
                        className='z-50 fixed top-1/2 left-0 transform translate-x-32 -translate-y-full'
                        title='YoMo blog'
                        width='800'
                        height='400'
                        src='https://blog.yomo.run'
                    >
                    </iframe>
                )
            }
        </>
    )
}

export default memo(EnterArea, () => true)
