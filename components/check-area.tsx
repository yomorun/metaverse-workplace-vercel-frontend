import { useEffect, useMemo, useState } from 'react'
import { Subscriber, Observable } from 'rxjs'
import { auditTime } from 'rxjs/operators'
import cn from 'classnames'

import { useRecoilValue } from 'recoil'
import { mePositionState } from '../store/atom'

import { checkCircularCollision } from '../libs/helper'
import { playerDiameter } from '../libs/constant'

import type { Area, Position } from '../types'

const CheckArea = ({
    checkAreaList = [],
    onEnterCheckArea,
    onLeaveCheckArea,
}: {
    checkAreaList: Area[]
    onEnterCheckArea?: (area: Area) => void
    onLeaveCheckArea?: () => void
}) => {
    const [subscriber, setSubscriber] = useState<Subscriber<Position> | null>(null)
    const mePosition = useRecoilValue(mePositionState)

    useEffect(() => {
        const positionObservable: Observable<Position> = new Observable(subscriber => {
            setSubscriber(subscriber)
        })

        const process = (entered: boolean, area: Area): boolean => {
            if (entered) {
                if (area.entered) {
                    return true
                }

                area.entered = true

                const areaBox = document.getElementById(area.id)
                if (areaBox) {
                    areaBox.classList.add('animate-pulse')
                    areaBox.classList.remove('hidden')
                }

                onEnterCheckArea && onEnterCheckArea(area)

                return true
            }

            if (area.entered) {
                area.entered = false

                const areaBox = document.getElementById(area.id)
                if (areaBox) {
                    areaBox.classList.add('hidden')
                    areaBox.classList.remove('animate-pulse')
                }

                onLeaveCheckArea && onLeaveCheckArea()
            }

            return false
        }

        const subscription = positionObservable.pipe(auditTime(500)).subscribe(position => {
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
        }
    }, [])

    useEffect(() => {
        if (subscriber) {
            subscriber.next(mePosition)
        }
    }, [mePosition, subscriber])

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
