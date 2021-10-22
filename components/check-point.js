
import Router from 'next/router'
import { useEffect, useContext, memo } from 'react'
import { Context } from '../context'
import { Observable } from 'rxjs'
import { debounceTime } from 'rxjs/operators'

import { checkCircularCollision } from '../libs/lib'

const CheckPoint = ({ sock, hostPlayerId, hostPlayerBoxId, checkPointList = [], scale = 1 }) => {
    const { dispatch } = useContext(Context)

    useEffect(() => {
        const movement$ = new Observable(obs => {
            sock.on('movement', mv => {
                if (mv.name === hostPlayerId) {
                    obs.next(mv)
                }
            })
        })

        const subscription = movement$.pipe(debounceTime(100)).subscribe(() => {
            const hostBox = document.getElementById(hostPlayerBoxId)

            if (!hostBox) {
                return
            }

            // Offset position of the background map
            const { left: parentLeft, top: parentTop } = hostBox.offsetParent.getBoundingClientRect()

            const { left, top } = hostBox.getBoundingClientRect()

            // Radius
            const r1 = hostBox.offsetWidth / 2

            // Center of circle position
            const x1 = left - parentLeft + r1
            const y1 = top - parentTop + r1


            for (let i = 0; i < checkPointList.length; i++) {
                const item = checkPointList[i]

                const r2 = (item.width / 2) * scale
                const x2 = item.position.x * scale + r2
                const y2 = item.position.y * scale + r2

                // Calculate the distance between two circle centers
                const { distance, collided } = checkCircularCollision(x1, y1, r1, x2, y2, r2)

                const bodyDistance = distance - r1 - r2

                const checkPointAnimateBox = document.getElementById(`${item.id}-animate-box`)

                if (bodyDistance > 0 && bodyDistance <= 200 * scale) {
                    if (checkPointAnimateBox && !checkPointAnimateBox.classList.contains('ym-animate-ping')) {
                        checkPointAnimateBox.classList.add('bg-green-500', 'ym-animate-ping')
                        dispatch({
                            type: 'SET_GUIDE_TEXT',
                            payload: {
                                guideText: item.guideText
                            }
                        })
                    }
                } else {
                    checkPointAnimateBox && checkPointAnimateBox.classList.remove('bg-green-500', 'ym-animate-ping')
                }

                if (collided && item.iframeSrc) {
                    if (item.entered) {
                        return
                    }

                    item.entered = true

                    if (item.nextPagePath) {
                        Router.push(item.nextPagePath)
                        return
                    }

                    checkPointAnimateBox && checkPointAnimateBox.classList.add('check-point-icon-bg')
                    dispatch({
                        type: 'OPEN_DRAWER',
                        payload: {
                            iframeSrc: item.iframeSrc
                        }
                    })
                    return
                } else {
                    item.entered = false
                    checkPointAnimateBox && checkPointAnimateBox.classList.remove('check-point-icon-bg')
                }
            }
        })

        return () => {
            subscription.unsubscribe()
        }
    }, [])

    if (!checkPointList.length) {
        return null
    }

    return checkPointList.map(item => (
        <div
            className='absolute flex justify-center items-center'
            key={item.id}
            style={{
                left: `${item.position.x}px`,
                top: `${item.position.y}px`,
                width: item.width,
                height: item.width,
            }}
        >
            <div
                className='absolute top-0 left-0 w-full h-full rounded-full'
                id={`${item.id}-animate-box`}
            />
            <img src={item.icon} alt='' />
        </div>
    ))
}

export default memo(CheckPoint, () => true)
