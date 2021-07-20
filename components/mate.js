import React from 'react'
import { Observable } from 'rxjs'
import { scan } from 'rxjs/operators'

import { Vector, move } from '../libs/movement'
import { Logger } from '../libs/lib'

const { useEffect, useState } = React

export default function Mate(props) {
    // position of the avatar
    const [left, setLeft] = useState(0)
    const [top, setTop] = useState(0)
    // user_id
    const [name, setName] = useState('')
    const log = new Logger(`Mate:${props.name}`, 'color: white; background: orange')

    useEffect(() => {
        // default position
        const POS = new Vector(props.pos.x || 0, props.pos.y || 0)

        // Redraw UI
        const renderPosition = (p) => {
            setLeft(p.x)
            setTop(p.y)
        }

        // initial position
        renderPosition(POS)

        // set name
        setName(props.name)

        const direction$ = new Observable(obs => {
            props.sock.on('movement', mv => {
                if (mv.name != props.name) {
                    return
                }
                obs.next(mv.dir)

                return function () {
                }
            })
        })

        // every direction changing event will cause position movement
        direction$.pipe(scan((currPos, dir) => currPos.add(dir), POS)).subscribe(renderPosition)

        return () => {
            log.log('unload')
        }
    }, [])

    return (
        <div
            className='absolute'
            style={{
                transform: `translate3d(${left}px, ${top}px, 0)`,
            }}
        >
            <img
                className='w-32 h-32 rounded-full shadow-lg'
                src={props.avatar}
            />
            <div className='mt-2 text-sm text-center'>{name}</div>
        </div>
    )
}
