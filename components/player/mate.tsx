import { useEffect, useRef, memo } from 'react'
import { Observable } from 'rxjs'
import { scan } from 'rxjs/operators'

import Sound from '../rtc/sound'
import Latency from '../minor/latency'

import { useRecoilValue, useSetRecoilState } from 'recoil'
import { trackMapState, matePositionMapState } from '../../store/atom'

import { Vector } from '../../libs/movement'
import { checkMobileDevice } from '../../libs/helper'
import flag from '../../libs/flag'

import type { Socket } from 'socket.io-client'
import type { Position } from '../../types'

const Mate = ({
    name,
    avatar,
    country,
    initPos,
    socket,
}: {
    name: string
    avatar: string
    country: string
    initPos: Position
    socket: Socket
}) => {
    const refContainer = useRef<HTMLDivElement>(null)
    const trackMap = useRecoilValue(trackMapState)
    const { videoTrack, audioTrack } = trackMap.get(name) || {
        videoTrack: null,
        audioTrack: null,
    }
    const setMatePositionMapState = useSetRecoilState(matePositionMapState)

    useEffect(() => {
        const isMobile = checkMobileDevice()

        // default position
        const POS = new Vector(initPos.x || 0, initPos.y || 0)

        // Redraw UI
        const renderPosition = (p: Position) => {
            if (refContainer.current) {
                refContainer.current.setAttribute(
                    'style',
                    `transform: translate3d(${p.x}px, ${p.y}px, 0);`
                )
            }
        }

        if (!isMobile) {
            // initial position
            renderPosition(POS)

            setMatePositionMapState(old => {
                const matePositionMap = new Map(old)
                matePositionMap.set(name, {
                    x: POS.x,
                    y: POS.y,
                })
                return matePositionMap
            })
        }

        const direction$ = new Observable<Vector>(obs => {
            socket.on('movement', mv => {
                if (mv.name != name || isMobile) {
                    return
                }

                obs.next(mv.dir)
            })
        })

        // every direction changing event will cause position movement
        const subscription = direction$
            .pipe(scan((currPos: Vector, dir: Vector) => currPos.add(dir), POS))
            .subscribe(currPos => {
                renderPosition(currPos)

                setMatePositionMapState(old => {
                    const matePositionMap = new Map(old)
                    matePositionMap.set(name, {
                        x: currPos.x,
                        y: currPos.y,
                    })
                    return matePositionMap
                })
            })

        // Add movement transition, it looks smoother
        setTimeout(() => {
            if (refContainer.current) {
                refContainer.current.classList.add('movement-transition')
            }
        }, 1000)

        return () => {
            subscription.unsubscribe()
        }
    }, [])

    useEffect(() => {
        if (videoTrack) {
            videoTrack.play(`stream-player-${name}`)
        }
    }, [videoTrack])

    return (
        <div className='absolute max-h-40 sm:relative sm-grid-card' ref={refContainer}>
            <div className='relative mx-auto w-32 h-32 flex flex-col items-center sm:w-28 sm:h-28'>
                <div className='w-full h-full rounded-full overflow-hidden transform translate-0 shadow-lg bg-white'>
                    <div id={`stream-player-${name}`} className='w-full h-full'>
                        {!videoTrack && <img className='w-full h-full' src={avatar} alt='avatar' />}
                    </div>
                </div>
                {audioTrack && (
                    <div className='absolute -top-20 left-0'>
                        <Sound id={name} audioTrack={audioTrack} />
                    </div>
                )}
            </div>
            <div className='absolute top-32 left-1/2 transform -translate-x-1/2 text-base text-white font-bold whitespace-nowrap sm:top-28'>
                {`${flag(country)} ${name}`}
            </div>
            <Latency name={name} socket={socket} />
        </div>
    )
}

export default memo(Mate, () => true)
