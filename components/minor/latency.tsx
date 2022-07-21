import { useState, useEffect } from 'react'
import { useRecoilValue } from 'recoil'
import { smallDeviceState } from '../../store/atom'
import type { Socket } from 'socket.io-client'
import { addLatencyMetric } from '../../libs/metrics'

const getLatencyBgColor = (latency: number) => {
    if (latency < 200) {
        return 'green'
    }

    if (latency >= 200 && latency < 300) {
        return '#FFB02A'
    }

    return 'red'
}

const Latency = ({
    isMaster = false,
    name,
    country,
    meshUrl,
    socket,
}: {
    isMaster?: boolean
    name: string
    country: string
    meshUrl: string
    socket: Socket
}) => {
    const smallDevice = useRecoilValue(smallDeviceState)
    const [latencyData, setLatencyData] = useState({
        latency: 0,
        backgroundColor: 'green',
    })

    useEffect(() => {
        if (isMaster) {
            socket.emit('ding', { timestamp: Date.now() })

            const intervalId = setInterval(() => {
                socket.emit('ding', { timestamp: Date.now() })
            }, 5000)

            socket.on('dang', payload => {
                if (!payload || !payload.timestamp || payload.name != name) {
                    return
                }

                const { timestamp } = payload
                const rtt = Date.now() - timestamp
                const latency = rtt / 2

                const backgroundColor = getLatencyBgColor(latency)
                setLatencyData({
                    latency,
                    backgroundColor,
                })

                socket.emit('latency', {
                    name,
                    latency,
                })

                // add metrics
                addLatencyMetric(country, meshUrl, timestamp, latency)
            })

            return () => {
                clearInterval(intervalId)
            }
        } else {
            socket.on('latency', payload => {
                if (payload.name != name) {
                    return
                }

                const { latency } = payload
                const backgroundColor = getLatencyBgColor(latency)
                setLatencyData({
                    latency,
                    backgroundColor,
                })
            })
        }
    }, [])

    if (smallDevice || latencyData.latency <= 0) {
        return null
    }

    return (
        <div
            className='absolute top-40 left-1/2 transform -translate-x-1/2 px-4 rounded-md text-sm text-white font-bold whitespace-nowrap'
            style={{
                top: 150,
                backgroundColor: latencyData.backgroundColor,
            }}
        >
            {latencyData.latency}ms
        </div>
    )
}

export default Latency
