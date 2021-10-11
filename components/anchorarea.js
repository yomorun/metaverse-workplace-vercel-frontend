import { useState, useEffect, useCallback, memo } from 'react'
import { Observable } from 'rxjs'
import { debounceTime } from 'rxjs/operators'
import Drawer from './drawer'
import { checkCircularCollision } from '../libs/lib'

const AnchorArea = ({ sock, hostPlayerId, hostPlayerBoxId, anchorAreaList = [] }) => {
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


        const hostBox = document.getElementById(hostPlayerBoxId)

        // Offset position of the background map
        let parentLeft = null, parentTop = null

        const subscription = movement$.pipe(debounceTime(500)).subscribe(mv => {
            if (!hostBox) {
                return
            }

            // Record the offset position of the background map
            if (parentLeft == null) {
                const { left, top } = hostBox.offsetParent.getBoundingClientRect()
                parentLeft = left
                parentTop = top
            }

            const { left, top } = hostBox.getBoundingClientRect()

            // Radius
            const r1 = hostBox.offsetWidth / 2

            // Center of circle position
            const x1 = left - parentLeft + r1
            const y1 = top - parentTop + r1

            for (let i = 0; i < anchorAreaList.length; i++) {
                const item = anchorAreaList[i]

                const r2 = item.diameter / 2
                const x2 = item.position.x + r2
                const y2 = item.position.y + r2

                const collided = checkCircularCollision(x1, y1, r1, x2, y2, r2)

                if (collided) {
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
                anchorAreaList.map(item => (
                    <div
                        className='bg-blue-600 bg-opacity-30 border-4 rounded-full border-blue-600 border-dotted animate-pulse'
                        key={item.id}
                        id={item.id}
                        style={{
                            position: 'absolute',
                            left: `${item.position.x}px`,
                            top: `${item.position.y}px`,
                            width: item.diameter,
                            height: item.diameter,
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

export default memo(AnchorArea, () => true)
