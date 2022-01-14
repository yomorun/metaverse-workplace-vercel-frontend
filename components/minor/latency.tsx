import { useState, useEffect } from 'react'
import type { Socket } from 'socket.io-client'

const Latency = ({
    isMaster = false,
    name,
    socket,
}: {
    isMaster?: boolean
    name: string
    socket: Socket
}) => {
    const [data, setData] = useState({
        meshId: 'US',
        latency: 50,
    })

    useEffect(() => {
        if (isMaster) {
            socket.emit('timestamp', { timestamp: Date.now() })

            const intervalId = setInterval(() => {
                socket.emit('timestamp', { timestamp: Date.now() })
            }, 5000)

            socket.on('timestamp', payload => {
                if (!payload || !payload.timestamp) {
                    return
                }

                const { timestamp, meshId } = payload
                const rtt = Date.now() - timestamp
                const latency = rtt / 2

                setData({
                    latency,
                    meshId,
                })

                socket.emit('latency', {
                    name,
                    latency,
                    meshId,
                })
            })

            return () => {
                clearInterval(intervalId)
            }
        } else {
            socket.on('latency', payload => {
                if (payload.name != name) {
                    return
                }

                const { meshId, latency } = payload

                setData({
                    latency,
                    meshId,
                })
            })
        }
    }, [])

    return (
        <div className='absolute top-36 left-1/2 transform -translate-x-1/2 text-base text-white font-bold whitespace-nowrap sm:top-30'>
            {data.latency > 0 ? `Edge node: ${data.meshId} (${data.latency}ms)` : ''}
        </div>
    )
}

export default Latency
