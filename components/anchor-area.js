import { useEffect, useContext, memo } from 'react'
import { Context } from '../context'
import { Observable } from 'rxjs'
import { debounceTime } from 'rxjs/operators'

import { checkCircularCollision } from '../libs/lib'

const AnchorArea = ({ sock, hostPlayerId, hostPlayerBoxId, anchorAreaList = [], scale = 1 }) => {
    const { dispatch } = useContext(Context)

    useEffect(() => {
        const movement$ = new Observable(obs => {
            sock.on('movement', mv => {
                if (mv.name === hostPlayerId) {
                    obs.next(mv)
                }
            })
        })

        const subscription = movement$.pipe(debounceTime(200)).subscribe(() => {
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

            for (let i = 0; i < anchorAreaList.length; i++) {
                const item = anchorAreaList[i]

                const r2 = (item.diameter / 2) * scale
                const x2 = item.position.x * scale + r2
                const y2 = item.position.y * scale + r2

                // Calculate the distance between two circle centers and determine if they collide
                const { collided } = checkCircularCollision(x1, y1, r1, x2, y2, r2)

                if (collided && item.iframeSrc) {
                    if (item.entered) {
                        return
                    }
                    item.entered = true
                    dispatch({
                        type: 'OPEN_DRAWER',
                        payload: {
                            iframeSrc: item.iframeSrc
                        }
                    })
                    return
                } else {
                    item.entered = false
                }
            }
        })

        return () => {
            subscription.unsubscribe()
        }
    }, [])

    if (!anchorAreaList.length) {
        return null
    }

    return anchorAreaList.map(item => (
        <div
            className='absolute bg-blue-600 bg-opacity-30 border-4 rounded-full border-blue-600 border-dotted animate-pulse'
            key={item.id}
            id={item.id}
            style={{
                left: `${item.position.x}px`,
                top: `${item.position.y}px`,
                width: item.diameter,
                height: item.diameter,
            }}
        />
    ))
}

export default memo(AnchorArea, () => true)
