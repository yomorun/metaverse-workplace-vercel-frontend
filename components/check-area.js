
import Router from 'next/router'
import { useEffect, useContext, memo } from 'react'
import { Context } from '../context'
import { Observable } from 'rxjs'
import { throttleTime } from 'rxjs/operators'

import { checkCircularCollision } from '../libs/lib'

const CheckArea = ({ sock, hostPlayerId, hostPlayerBoxId, checkAreaList = [], scale = 1 }) => {
    const { dispatch } = useContext(Context)

    useEffect(() => {
        const movement$ = new Observable(obs => {
            sock.on('movement', mv => {
                if (mv.name === hostPlayerId) {
                    obs.next(mv)
                }
            })
        })

        const openDrawer = (data, type = 'imgs') => {
            if (type === 'imgs') {
                dispatch({
                    type: 'OPEN_DRAWER',
                    payload: {
                        imgList: data
                    }
                })
            } else if (type === 'iframe') {
                dispatch({
                    type: 'OPEN_DRAWER',
                    payload: {
                        iframeSrc: data
                    }
                })
            }
        }

        const subscription = movement$.pipe(throttleTime(500)).subscribe(() => {
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

            for (let i = 0; i < checkAreaList.length; i++) {
                const item = checkAreaList[i]

                if (item.rectangle) {
                    const left = item.position.x * scale
                    const top = item.position.y * scale
                    const right = item.rectangle.width * scale + left
                    const bottom = item.rectangle.height * scale + top

                    if (x1 > left && x1 < right && y1 > top && y1 < bottom) {
                        if (item.entered) {
                            return
                        }

                        item.entered = true

                        if (item.nextPagePath) {
                            Router.push(item.nextPagePath)
                            return
                        }

                        const rectangleBox = document.getElementById(item.id)
                        if (rectangleBox) {
                            rectangleBox.classList.add('animate-pulse')
                            rectangleBox.classList.remove('hidden')
                        }


                        if (item.imgList) {
                            openDrawer(item.imgList, 'imgs')
                        } else if (item.iframeSrc) {
                            openDrawer(item.iframeSrc, 'iframe')
                        }

                        return
                    } else {
                        item.entered = false
                        const rectangleBox = document.getElementById(item.id)
                        if (rectangleBox) {
                            rectangleBox.classList.add('hidden')
                            rectangleBox.classList.remove('animate-pulse')
                        }
                    }
                } else if (item.circle) {
                    const r2 = (item.circle.diameter / 2) * scale
                    const x2 = item.position.x * scale + r2
                    const y2 = item.position.y * scale + r2

                    // Calculate the distance between two circle centers
                    const { collided } = checkCircularCollision(x1, y1, r1, x2, y2, r2)



                    if (collided) {
                        if (item.entered) {
                            return
                        }

                        item.entered = true

                        if (item.nextPagePath) {
                            Router.push(item.nextPagePath)
                            return
                        }

                        const checkAreaAnimateBox = document.getElementById(`${item.id}-animate-box`)
                        if (checkAreaAnimateBox) {
                            checkAreaAnimateBox.classList.add('animate-pulse')
                            checkAreaAnimateBox.classList.remove('hidden')
                        }

                        if (item.imgList) {
                            openDrawer(item.imgList, 'imgs')
                        } else if (item.iframeSrc) {
                            openDrawer(item.iframeSrc, 'iframe')
                        }

                        return
                    } else {
                        item.entered = false
                        const checkAreaAnimateBox = document.getElementById(`${item.id}-animate-box`)
                        if (checkAreaAnimateBox) {
                            checkAreaAnimateBox.classList.add('hidden')
                            checkAreaAnimateBox.classList.remove('animate-pulse')
                        }
                    }
                }
            }
        })

        return () => {
            subscription.unsubscribe()
        }
    }, [])

    if (!checkAreaList.length) {
        return null
    }

    return checkAreaList.map(item => (
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
                    width: item.circle.diameter,
                    height: item.circle.diameter
                }}
            >
                <img
                    className='absolute top-0 left-0 w-full h-full rounded-full hidden'
                    src='/check-area/area-icon.png'
                    id={`${item.id}-animate-box`}
                />
            </div>
        )
    ))
}

export default memo(CheckArea, () => true)
