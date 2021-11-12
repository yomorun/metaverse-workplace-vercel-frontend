import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent, act } from '@testing-library/react'
import preloadAll from 'jest-next-dynamic'
import { RecoilRoot, RecoilState, useRecoilValue } from 'recoil'
import { mePositionState } from '../store/atom'
import useSocket from '../components/hooks/use-socket'
import { useEffect } from 'react'
import type { Position } from '../types'
import dynamic from 'next/dynamic'
const Me = dynamic(() => import('../components/player/me'), { ssr: false })

jest.mock('socket.io-client', () => {
    const mSocket = {
        emit: jest.fn(),
        on: jest.fn(),
        connect: jest.fn(),
        disconnect: jest.fn(),
    }
    return jest.fn(() => mSocket)
})

jest.mock('axios')

const RecoilObserver = <T,>({
    atom,
    onChange,
}: {
    atom: RecoilState<T>
    onChange: (v: T) => void
}) => {
    const value = useRecoilValue(atom)
    useEffect(() => onChange(value), [value])
    return null
}

describe('Me Component', () => {
    beforeAll(async () => {
        global.ImageData = jest.fn()

        Object.defineProperty(global.navigator, 'mediaDevices', {
            value: {
                enumerateDevices: jest.fn(async () => {
                    return new Promise(resolve => {
                        const devices = [
                            {
                                kind: 'videoinput',
                                label: '',
                                deviceId: '',
                            },
                            {
                                kind: 'audioinput',
                                label: '',
                                deviceId: '',
                            },
                        ]

                        resolve(devices)
                    })
                }),
            },
        })

        preloadAll()
    })

    const TestComponent = () => {
        const name = 'TestName'
        const image = './avatar.png'
        const initPos = { x: 50, y: 50 }
        const socket = useSocket({
            me: {
                name,
                image,
            },
            position: initPos,
            room: 'home',
        })

        if (!socket) {
            return <></>
        }

        return (
            <Me
                name={name}
                avatar={image}
                initPos={initPos}
                socket={socket}
                channel='home'
                boundary={{ top: 0, left: 0, bottom: 900, right: 1800 }}
            />
        )
    }

    it('Render Component', () => {
        const { getByText } = render(
            <RecoilRoot>
                <TestComponent />
            </RecoilRoot>
        )

        expect(getByText(/TestName/)).toBeInTheDocument()
    })

    it('Testing fireEvent keypress', async () => {
        const spy = jest.fn()

        render(
            <RecoilRoot>
                <RecoilObserver<Position>
                    atom={mePositionState}
                    onChange={(v: Position) => {
                        spy(v)
                    }}
                />
                <TestComponent />
            </RecoilRoot>
        )

        fireEvent.keyPress(document, { key: 'D', code: 'KeyD' })

        await act(async () => {
            await new Promise(r => setTimeout(r, 200))
        })

        expect(spy).toHaveBeenCalledWith({ x: 60, y: 50 })
    })
})
