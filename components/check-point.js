import { useState, useEffect, useCallback, memo } from 'react'
import { Observable } from 'rxjs'
import { throttleTime } from 'rxjs/operators'

import Drawer from './drawer'

import { checkCircularCollision } from '../libs/lib'

const CheckPoint = ({ sock, hostPlayerId, hostPlayerBoxId, checkPointList = [] }) => {
    const [showDrawer, setShowDrawer] = useState(false)
    const [iframeSrc, setIframeSrc] = useState('')

    useEffect(() => {
        const movement$ = new Observable(obs => {
            sock.on('movement', mv => {
                if (mv.name === hostPlayerId) {
                    obs.next(mv)
                }
            })
        })

        const subscription = movement$.pipe(throttleTime(1000)).subscribe(() => {
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

                const r2 = item.width / 2
                const x2 = item.position.x + r2
                const y2 = item.position.y + r2

                // Calculate the distance between two circle centers
                const { distance } = checkCircularCollision(x1, y1, r1, x2, y2, r2)

                const bodyDistance = distance - r1 - r2

                // Play the checkpoint bounce animation when the body distance is between 10px and 200px.
                if (bodyDistance >= 10 && bodyDistance <= 200) {
                    const checkPointBox = document.getElementById(item.id)
                    checkPointBox && checkPointBox.classList.add('animate-bounce')
                } else {
                    // Ignore distant checkpoints
                    if (bodyDistance < 500) {
                        const checkPointBox = document.getElementById(item.id)
                        checkPointBox &&  checkPointBox.classList.remove('animate-bounce')
                    }
                }

                // When the body distance is less than or equal to 10px, it means that a collision has occurred.
                if (bodyDistance <= 10) {
                    setIframeSrc(item.iframeSrc)
                    setShowDrawer(true)
                    return
                }
            }
        })

        return () => {
            subscription.unsubscribe()
        }
    }, [])

    const closeDrawer = useCallback(() => {
        setIframeSrc('')
        setShowDrawer(false)
    }, [])

    return (
        <>
            {
                checkPointList.map(item => (
                    <img
                        key={item.id}
                        id={item.id}
                        src={item.icon}
                        alt=''
                        style={{
                            position: 'absolute',
                            left: `${item.position.x}px`,
                            top: `${item.position.y}px`,
                            width: item.width,
                            height: item.width,
                        }}
                    />
                ))
            }
            <Drawer isOpen={showDrawer} onClose={closeDrawer}>
                <iframe
                    title=''
                    width='100%'
                    height='100%'
                    src={iframeSrc}
                />
            </Drawer>
        </>
    )
}

export default memo(CheckPoint, () => true)
