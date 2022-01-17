import { useState, useEffect } from 'react'
import { useRecoilValue } from 'recoil'
import { smallDeviceState } from '../../store/atom'
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
    const smallDevice = useRecoilValue(smallDeviceState)

    const [data, setData] = useState({
        meshId: '',
        latency: 0,
    })

    const [e2eLatency, setE2eLatency] = useState(0)

    useEffect(() => {
        if (isMaster) {
            socket.emit('ding', { timestamp: Date.now() })

            const intervalId = setInterval(() => {
                socket.emit('ding', { timestamp: Date.now() })
            }, 5000)

            socket.on('dang', payload => {
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

            socket.on('movement', mv => {
                if (mv.name != name) {
                    return
                }

                if (mv.timestamp) {
                    setE2eLatency(Date.now() - mv.timestamp)
                }
            })
        }
    }, [])

    if (smallDevice) {
        return null
    }

    return (
        <>
            {data.latency > 0 && (
                <div className='absolute top-36 left-1/2 transform -translate-x-1/2 text-base text-white font-bold whitespace-nowrap'>
                    Edge node: {data.meshId} ({data.latency}ms)
                </div>
            )}
            {e2eLatency > 0 && (
                <div className='absolute top-40 left-1/2 transform -translate-x-1/2 text-base text-white font-bold whitespace-nowrap'>
                    E2e latency: {e2eLatency}ms
                </div>
            )}
        </>
    )
}

export default Latency
