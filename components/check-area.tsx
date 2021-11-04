import { useEffect, useMemo } from 'react'
import { Subscriber, Observable } from 'rxjs'
import { throttleTime } from 'rxjs/operators'

import { useRecoilValue } from 'recoil'
import { mePositionState } from '../store/atom'

import { checkCircularCollision } from '../libs/helper'
import { playerDiameter } from '../libs/constant'

import type { Area, Position } from '../types'

type Props = {
    checkAreaList: Area[]
    onEnterCheckArea?: (area: Area) => void
    onLeaveArea?: () => void
}

let positionSubscriber: Subscriber<Position> | null

const CheckArea = ({ checkAreaList = [], onEnterCheckArea, onLeaveArea }: Props) => {
    const mePosition = useRecoilValue(mePositionState)

    useEffect(() => {
        if (positionSubscriber) {
            positionSubscriber.next(mePosition)
        }
    }, [mePosition])

    useEffect(() => {
        const positionObservable: Observable<Position> = new Observable(subscriber => {
            positionSubscriber = subscriber
        })

        const subscription = positionObservable.pipe(throttleTime(200)).subscribe(position => {
            // Radius
            const r1 = playerDiameter / 2

            // Center of circle position
            const x1 = position.x + r1
            const y1 = position.y + r1

            for (let i = 0; i < checkAreaList.length; i++) {
                const item = checkAreaList[i]

                if (item.rectangle) {
                    const left = item.position.x
                    const top = item.position.y
                    const right = item.rectangle.width + left
                    const bottom = item.rectangle.height + top

                    if (x1 > left && x1 < right && y1 > top && y1 < bottom) {
                        if (item.entered) {
                            return
                        }

                        item.entered = true

                        const rectangleBox = document.getElementById(item.id)
                        if (rectangleBox) {
                            rectangleBox.classList.add('animate-pulse')
                            rectangleBox.classList.remove('hidden')
                        }

                        onEnterCheckArea && onEnterCheckArea(item)

                        return
                    } else {
                        if (item.entered) {
                            item.entered = false
                            onLeaveArea && onLeaveArea()
                            const rectangleBox = document.getElementById(item.id)
                            if (rectangleBox) {
                                rectangleBox.classList.add('hidden')
                                rectangleBox.classList.remove('animate-pulse')
                            }
                        }
                    }
                } else if (item.circle) {
                    const r2 = item.circle.diameter / 2
                    const x2 = item.position.x + r2
                    const y2 = item.position.y + r2

                    // Calculate the distance between two circle centers
                    const collided = checkCircularCollision(x1, y1, r1, x2, y2, r2)

                    if (collided) {
                        if (item.entered) {
                            return
                        }

                        item.entered = true

                        const checkAreaAnimateBox = document.getElementById(
                            `${item.id}-animate-box`
                        )
                        if (checkAreaAnimateBox) {
                            checkAreaAnimateBox.classList.add('animate-pulse')
                            checkAreaAnimateBox.classList.remove('hidden')
                        }

                        onEnterCheckArea && onEnterCheckArea(item)

                        return
                    } else {
                        if (item.entered) {
                            item.entered = false
                            onLeaveArea && onLeaveArea()
                            const checkAreaAnimateBox = document.getElementById(
                                `${item.id}-animate-box`
                            )
                            if (checkAreaAnimateBox) {
                                checkAreaAnimateBox.classList.add('hidden')
                                checkAreaAnimateBox.classList.remove('animate-pulse')
                            }
                        }
                    }
                }
            }
        })

        return () => {
            subscription.unsubscribe()
            positionSubscriber = null
        }
    }, [])

    return useMemo(
        () => (
            <>
                {checkAreaList.map(item =>
                    item.rectangle ? (
                        <div
                            className='absolute bg-blue-600 bg-opacity-30 border-4 border-blue-600 border-dotted hidden'
                            key={item.id}
                            id={item.id}
                            style={{
                                left: item.position.x,
                                top: item.position.y,
                                width: item.rectangle.width,
                                height: item.rectangle.height,
                            }}
                        />
                    ) : (
                        <div
                            className='absolute'
                            key={item.id}
                            id={item.id}
                            style={{
                                left: item.position.x,
                                top: item.position.y,
                                width: item.circle?.diameter,
                                height: item.circle?.diameter,
                            }}
                        >
                            <img
                                className='absolute top-0 left-0 w-full h-full rounded-full hidden'
                                src='/check-area/area-icon.png'
                                id={`${item.id}-animate-box`}
                                alt=''
                            />
                        </div>
                    )
                )}
            </>
        ),
        [checkAreaList.length]
    )
}

export default CheckArea
