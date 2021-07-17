import React from 'react'
import { fromEvent } from 'rxjs'
import { map, filter, scan, auditTime } from 'rxjs/operators'

import {Vector, move} from '../libs/movement'
import { Logger } from '../libs/lib'

const { useEffect, useState, useRef } = React

const log = new Logger("Me", "color: white; background: green")

// Only accepts events from the W, A, S and D buttons
const keyPressWASD = (e) => {
  switch (e.keyCode) {
    case 119:
    case 115:
    case 97:
    case 100:
      return true
    default:
      return false
  }
}

export default function Yoser(props) {
  // position of the avatar
  const [left, setLeft] = useState(0)
  const [top, setTop] = useState(0)
  // video
  const videoRef = useRef(null);
  const [videoState, setVideoState] = useState(false)

  useEffect(() => {
    // default position
    const POS = new Vector(props.pos.left || 0, props.pos.top || 0)

    // Redraw UI
    const renderPosition = (p) => {
      // log.info(`[${props.name}] pos: ${p.toString()}`)
      setLeft(p.x)
      setTop(p.y)
    }

    // initial position
    renderPosition(POS)

    // Answer server query, when other mates go online, server will ask others' states,
    // this is the response
    props.sock.on('ask', () => {
      log.log('[ask], response as', props.name, 'avatar:', props.avatar)
      props.sock.emit('sync', {name: props.name, pos: POS, avatar: props.avatar })  
    })

    // initial websocket communication
    log.log('props.sock ->', props)
    log.log('props.sock props.name->', props.name)

    // TODO：Broadcast movement event streams to others in this game room
    const broadcastEvent = (evt) => {
      props.sock.emit('movement', {dir: evt})
    }

    // keyboard `keypress` event, we use keyboard to control moving actions
    const evtKeyPress = fromEvent(document, 'keypress').pipe(
      auditTime(16),
      map((e) => {
        return { evt: 'move', keyCode: e.keyCode }
      })
    )

    // ignore keys other than W/A/S/D
    var keyPress$ = evtKeyPress.pipe(filter(keyPressWASD))

    // stream of direction changing, this will turns w/a/s/d keypress event into direction vector changing streams
    var direction$ = keyPress$.pipe(
      map(move),
      map((p) => p.dir)
    )

    // every direction changing event will cause position movement
    direction$.pipe(scan((_currPos, _dir) => _currPos.add(_dir), POS)).subscribe(renderPosition)

    // every direction changing will emit to others over websocket
    direction$.subscribe(broadcastEvent)

    // connect to socket.io server
    props.sock.connect()

    return () => {
      log.log('[Unmount] event')
    }
  }, [])

  useEffect(()=>{
    log.log('videoState=', videoState)
    if(videoState) {
      navigator.mediaDevices
      .getUserMedia({ video: { width: 160, height: 160 } })
      .then(stream => {
        let video = videoRef.current
        video.srcObject = stream
        video.play()
      })
      .catch(err => {
        console.error("[Me] error:", err);
      });
    } else {
      let video = videoRef.current
      log.log(video)
      if(video.srcObject){
        video.srcObject.getVideoTracks()[0].stop()  
      }
    }
  }, [videoState])

  /* Video */
  const getVideo = () => {
    setVideoState(true)
  };

  const stopVideo = () => {
    setVideoState(false)
  }

  const capture = () => {
    let track = videoRef.current.srcObject.getVideoTracks()[0];
    let imageCapture = new ImageCapture(track);
    imageCapture.grabFrame()
    .then(imageBitmap => {
      log.log(imageBitmap)
      var canvas = document.createElement('canvas');
      canvas.width = 160
      canvas.height = 160
      canvas.getContext('2d').drawImage(imageBitmap, 0, 0, 160, 160);

      log.log(canvas.toDataURL('image/png'));
    })
    .catch(log.error);
  }

  return (
    <div
    style={{
      position: 'absolute',
      transform: `translate3d(${left}px, ${top}px, 0)`
    }}>
      <img src={props.avatar} width="160px" height="160px" 
      style={{
        width: '120px',
        height: '120px',
        borderRadius: '50%',
        WebkitTransform: "scaleX(-1)",
        transform: "scaleX(-1)",
      }}/>
    <video 
      ref={ videoRef } 
      style={{
        width: '160px',
        height: '160px',
        borderRadius: '50%',
        WebkitTransform: "scaleX(-1)",
        transform: "scaleX(-1)",
        display: "none",
      }}/>
    <div style={{ fontSize:'8pt', display: "none" }}>
      <button onClick={ getVideo }>StartVideo</button>
      <button onClick={ stopVideo }>Stop Video</button>
      <button onClick={ capture }>Capture</button>
    </div>
    </div>
  )
}
