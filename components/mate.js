import { useEffect, useState, useCallback } from 'react'
import { Observable } from 'rxjs'
import { scan } from 'rxjs/operators'

import { Vector, move } from '../libs/movement'
import { Logger, addTransition } from '../libs/lib'

import Sound from './sound'

export default function Mate({ name, avatar, initPos, sock, videoTrack, audioTrack, hostId }) {
    // position of the avatar
    const [left, setLeft] = useState(0)
    const [top, setTop] = useState(0)

    const [canCalcDistance, setCanCalcDistance] = useState(false)

    const log = new Logger(`Mate:${name}`, 'color: white; background: orange')

    useEffect(() => {
        // default position
        const POS = new Vector(initPos.x || 0, initPos.y || 0)

        // Redraw UI
        const renderPosition = (p) => {
            setLeft(p.x)
            setTop(p.y)
        }

        // initial position
        renderPosition(POS)

        const direction$ = new Observable(obs => {
            sock.on('movement', mv => {
                if (mv.name === name || mv.name === hostId) {
                    setCanCalcDistance(true)
                }

                if (mv.name != name) {
                    return
                }

                obs.next(mv.dir)
            })
        })

        // every direction changing event will cause position movement
        direction$.pipe(scan((currPos, dir) => currPos.add(dir), POS)).subscribe(renderPosition)

        // Add movement transition, it looks smoother
        addTransition(`${name}-movement-box`, 'movement-transition')

        return () => {
            log.log('unload')
        }
    }, [])

    useEffect(() => {
        if (videoTrack) {
            videoTrack.play(`stream-player-${name}`)
        }
    }, [videoTrack])

    const onComplete = useCallback(() => {
        setCanCalcDistance(false)
    }, [])

    return (
        <div
            id={`${name}-movement-box`}
            className='absolute'
            style={{
                transform: `translate3d(${left}px, ${top}px, 0)`
            }}
        >
            <div className='relative w-32 h-32'>
                <div className='w-full h-full rounded-full overflow-hidden transform translate-0 shadow-lg'>
                    <div id={`stream-player-${name}`} className='w-full h-full'>
                        {!videoTrack && <img className='w-full h-full' src={avatar} />}
                    </div>
                </div>
                {audioTrack && (
                    <div className='absolute -top-20 left-0'>
                        <Sound
                            audioTrack={audioTrack}
                            elementIdPrefix='stream-player-'
                            hostId={hostId}
                            mateId={name}
                            canCalcDistance={canCalcDistance}
                            onComplete={onComplete}
                        />
                    </div>
                )}
            </div>
            <div className='mt-2 text-base text-center text-white font-bold'>{name}</div>
        </div>
    )
}
