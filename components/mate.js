import { useEffect, useState, useRef, useCallback, memo } from 'react'
import { Observable } from 'rxjs'
import { scan } from 'rxjs/operators'

import { Vector, move } from '../libs/movement'
import { Logger } from '../libs/lib'

import Sound from './sound'

function Mate({ name, avatar, initPos, sock, videoTrack, audioTrack, hostId }) {
    const refContainer = useRef(null)

    useEffect(() => {
        const log = new Logger(`Mate:${name}`, 'color: white; background: orange')

        // default position
        const POS = new Vector(initPos.x || 0, initPos.y || 0)

        // Redraw UI
        const renderPosition = (p) => {
            if (refContainer.current) {
                refContainer.current.style = `transform: translate3d(${p.x}px, ${p.y}px, 0);`
            }
        }

        // initial position
        renderPosition(POS)

        const direction$ = new Observable(obs => {
            sock.on('movement', mv => {
                if (mv.name != name) {
                    return
                }

                obs.next(mv.dir)
            })
        })

        // every direction changing event will cause position movement
        direction$.pipe(scan((currPos, dir) => currPos.add(dir), POS)).subscribe(renderPosition)

        // Add movement transition, it looks smoother
        setTimeout(() => {
            if (refContainer.current) {
                refContainer.current.classList.add('movement-transition')
            }
        }, 1000)

        return () => {
            log.log('unload')
        }
    }, [])

    useEffect(() => {
        if (videoTrack) {
            videoTrack.play(`stream-player-${name}`)
        }
    }, [videoTrack])

    return (
        <div className='absolute' ref={refContainer}>
            <div className='relative w-32 h-32'>
                <div className='w-full h-full rounded-full overflow-hidden transform translate-0 shadow-lg'>
                    <div id={`stream-player-${name}`} className='w-full h-full'>
                        {!videoTrack && <img className='w-full h-full' src={avatar} />}
                    </div>
                </div>
                <div
                    className='absolute -top-20 left-0'
                    style={{ display: audioTrack ? 'block' : 'none'}}
                >
                    <Sound
                        audioTrack={audioTrack}
                        elementIdPrefix='stream-player-'
                        hostId={hostId}
                        mateId={name}
                        sock={sock}
                    />
                </div>
            </div>
            <div className='mt-2 text-base text-center text-white font-bold'>{name}</div>
        </div>
    )
}

function areEqual(prevProps, nextProps) {
    let audioTrackIsEqual = false
    if (prevProps.audioTrack && nextProps.audioTrack) {
        audioTrackIsEqual = prevProps.audioTrack._ID === nextProps.audioTrack._ID
    } else {
        audioTrackIsEqual = prevProps.audioTrack == null && nextProps.audioTrack == null
    }

    let videoTrackIsEqual = false
    if (prevProps.videoTrack && nextProps.videoTrack) {
        videoTrackIsEqual = prevProps.videoTrack._ID === nextProps.videoTrack._ID
    } else {
        videoTrackIsEqual = prevProps.videoTrack == null && nextProps.videoTrack == null
    }

    return audioTrackIsEqual && videoTrackIsEqual
}


export default memo(Mate, areEqual)
