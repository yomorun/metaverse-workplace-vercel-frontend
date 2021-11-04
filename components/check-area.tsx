import { useEffect, useMemo } from 'react'
import { Subscriber, Observable } from 'rxjs'
import { throttleTime } from 'rxjs/operators'
import cn from 'classnames'

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

        const process = (entered: boolean, area: Area): boolean => {
            if (entered) {
                if (area.entered) {
                    return true
                }

                area.entered = true

                const rectangleBox = document.getElementById(area.id)
                if (rectangleBox) {
                    rectangleBox.classList.add('animate-pulse')
                    rectangleBox.classList.remove('hidden')
                }

                onEnterCheckArea && onEnterCheckArea(area)

                return true
            } else {
                if (area.entered) {
                    area.entered = false

                    const rectangleBox = document.getElementById(area.id)
                    if (rectangleBox) {
                        rectangleBox.classList.add('hidden')
                        rectangleBox.classList.remove('animate-pulse')
                    }

                    onLeaveArea && onLeaveArea()
                }
            }

            return false
        }

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

                    const entered = x1 > left && x1 < right && y1 > top && y1 < bottom

                    if (process(entered, item)) {
                        return
                    }
                } else if (item.round) {
                    const r2 = item.round.diameter / 2
                    const x2 = item.position.x + r2
                    const y2 = item.position.y + r2

                    // Calculate the distance between two circle centers
                    const collided = checkCircularCollision(x1, y1, r1, x2, y2, r2)

                    if (process(collided, item)) {
                        return
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
                {checkAreaList.map(item => (
                    <div
                        className={cn(
                            'absolute bg-blue-600 bg-opacity-30 border-4 border-blue-600 border-dotted hidden',
                            {
                                'rounded-full': !!item.round,
                            }
                        )}
                        key={item.id}
                        id={item.id}
                        style={{
                            left: item.position.x,
                            top: item.position.y,
                            width: item.rectangle ? item.rectangle.width : item.round?.diameter,
                            height: item.rectangle ? item.rectangle.height : item.round?.diameter,
                        }}
                    />
                ))}
            </>
        ),
        [checkAreaList.length]
    )
}

export default CheckArea
