import React from 'react'
import { Observable } from 'rxjs'
import { scan } from 'rxjs/operators'

import {Vector, move} from '../libs/movement'
import { Logger } from '../libs/lib'

const { useEffect, useState } = React

export default function Mate(props) {
  // position of the avatar
  const [left, setLeft] = useState(0)
  const [top, setTop] = useState(0)
  // user_id
  const [name, setName] = useState("")
  const log = new Logger(`Mate:${props.name}`, "color: white; background: orange")

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
        if(mv.name != props.name){
          return
        }
        obs.next(mv.dir)

        return function(){
        }
      })
    })

    // every direction changing event will cause position movement
    direction$.pipe(scan((currPos, dir) => currPos.add(dir), POS)).subscribe(renderPosition)

    return () => {
      log.log("unload")
    }
  }, [])

  let blob ="data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22160%22%20height%3D%22160%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20160%20160%22%20preserveAspectRatio%3D%22none%22%3E%0A%20%20%20%20%20%20%3Cdefs%3E%0A%20%20%20%20%20%20%20%20%3Cstyle%20type%3D%22text%2Fcss%22%3E%0A%20%20%20%20%20%20%20%20%20%20%23holder%20text%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20fill%3A%20%23ffffff%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20font-family%3A%20sans-serif%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20font-size%3A%2016px%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20font-weight%3A%20400%3B%0A%20%20%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%20%20%3C%2Fstyle%3E%0A%20%20%20%20%20%20%3C%2Fdefs%3E%0A%20%20%20%20%20%20%3Cg%20id%3D%22holder%22%3E%0A%20%20%20%20%20%20%20%20%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22%23396b01%22%3E%3C%2Frect%3E%0A%20%20%20%20%20%20%20%20%3Cg%3E%0A%20%20%20%20%20%20%20%20%20%20%3Ctext%20text-anchor%3D%22middle%22%20x%3D%2250%25%22%20y%3D%2250%25%22%20dy%3D%22.3em%22%3EYoMo%3C%2Ftext%3E%0A%20%20%20%20%20%20%20%20%3C%2Fg%3E%0A%20%20%20%20%20%20%3C%2Fg%3E%0A%20%20%20%20%3C%2Fsvg%3E"
  
  return (
    <div
    style={{
      position: 'absolute',
      transform: `translate3d(${left}px, ${top}px, 0)`,
    }}>
    <img
      // src="https://blog.yomo.run/static/images/logo.png"
      src={blob}
      style={{
        width: '160px',
        height: '160px',
        borderRadius: '50%',
      }}
    />
    <div style={{fontSize:'8pt'}}>{name}</div>
    </div>
  )
}
