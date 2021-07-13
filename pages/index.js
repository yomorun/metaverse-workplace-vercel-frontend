import React, { useEffect, useState } from 'react'
import Router from 'next/router'
import dynamic from 'next/dynamic'
import io from "socket.io-client";
import axios from 'axios'
import Layout from '../components/layout'
import Sidebar from '../components/sidebar'
import { Vector } from '../libs/movement'
import { uuidv4, Logger } from '../libs/lib'

// init socket.io client
const ws = io(process.env.NEXT_PUBLIC_WEBSOCKET_URL, {
  reconnectionDelayMax: 10000,
  transports: ["websocket"],
  reconnection: false,
  autoConnect: false,
})

const Me = dynamic(() => import('../components/me'), { ssr: false })
const Mate = dynamic(() => import('../components/mate'), { ssr: false })

const log = new Logger("Index", "color: green; background: yellow")
const myName = uuidv4()

const isDEV = process.env.NODE_ENV == "development"
log.log("isDEV=", isDEV)

export default function Index() {
  const [logged, setLogged] = useState(false)
  const [onlineState, setOnlineState] = useState(false)

  useEffect(() => {
    const accessToken = localStorage.getItem(process.env.NEXT_PUBLIC_ACCESSTOKENKEY)
    const user = localStorage.getItem(process.env.NEXT_PUBLIC_USERKEY)
    if (!isDEV && !accessToken) {
      Router.push('/login')
      return
    }

    setLogged(true)
    log.log('accessToken:', accessToken)
    log.log('user:', JSON.parse(user))
  }, [])

  const [mates, setMates] = useState([])

  useEffect(() => {
    // `online` event will be occured when user is connected to websocket
    ws.on('online', mate => {
      if(mate.name == myName) {
        log.log('[online] is Me, ignore', myName)
        return
      }
      mate.key = mate.name
      mate.pos = new Vector(15, 15)
      setMates(arr => [...arr, mate])
      log.log('[online] over:', mates.length)
    })

    // `offline` event will be occured when other users leave
    ws.on('offline', mate => {
      log.log('[offline]', mate.name)
      setMates(arr => arr.filter(p => p.name != mate.name))
      log.log('[offline] counts: ', mates.length)
    })

    ws.on('ask', p => {
      log.log("[ask]", p)
    })

    ws.on('movement', mv => {
      log.log("[movement]", mv)
    })

    ws.on('sync', state => {
      log.log("[sync]", state, ", Me:", myName)
      if(state.name == myName) {
        log.log('[sync] is Me, ignore', myName)
        return
      }

      setMates(arr => {
        let shouldAdd = arr.every(p => {
          if(p.name == state.name){
            return false
          }
          return true
        })
        if(shouldAdd) {
          log.log("[sync] add", state)
          state.key = state.name
          return [...arr, state]
        }
        return arr
      })
    })

    // broadcast to others I am online when WebSocket connected
    ws.on('connect', () => { 
      log.log("WS CONNECTED", ws.id, ws.connected)
      setOnlineState(true)
      ws.emit("online", {name: myName})
    })

    ws.on('disconnect', (reason) => { 
      console.error("WS DISCONNECT", reason)
      setOnlineState(false)
    })

    ws.on('connect_error', (error) => { 
      console.error("WS CONNECT_ERROR", error)
      setOnlineState(false)
    })

    return () => {
      ws.disconnect("bye")
    }
  }, [])

  const disconnect = () => {
    log.log('[disconnect] EVT')
    ws.disconnect()
  }

  // if (!logged) {
  //   return null
  // }

  return (
    <Layout>
      <Sidebar onlineState={ onlineState } count = { mates.length + 1 } />
      <section>
        <Me sock={ws} name={myName} pos={{left:15, top:30}} />
        {mates.map(m => {
          return <Mate key={m.name} sock={ws} name={m.name} pos={m.pos} />
        })}
        <button onClick={ disconnect } >Disconnect</button>
      </section>
  </Layout>
  )
}
