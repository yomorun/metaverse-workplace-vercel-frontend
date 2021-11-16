import '@testing-library/jest-dom/extend-expect'
import { render, act } from '@testing-library/react'
import { renderHook } from '@testing-library/react-hooks'
import { RecoilRoot, RecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import { mateMapState } from '../store/atom'
import SocketMock from 'socket.io-mock'
import useSocket from '../components/hooks/use-socket'
import { useEffect } from 'react'
import { Vector } from '../libs/movement'
import type { Mate } from '../types'

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

describe('unit test for custom hook useSocket', () => {
    const me = {
        name: 'TestName',
        image: './avatar.png',
    }

    const position = {
        x: 30,
        y: 60,
    }

    let socketMock: SocketMock

    beforeAll(() => {
        socketMock = new SocketMock()
    })

    it('Render Hook', () => {
        const { result } = renderHook(() =>
            useSocket({
                me,
                position,
                room: 'home',
            })
        )

        expect(result.current).not.toEqual(null)
    })

    it('Testing the code for players to join the scene', () => {
        let mateMap: Map<string, Mate> = new Map()

        const TestComponent = () => {
            const setMateMapState = useSetRecoilState(mateMapState)

            useEffect(() => {
                const socket = socketMock.socketClient

                socket.on('online', mate => {
                    if (mate.name === me.name) {
                        return
                    }

                    setMateMapState(old => {
                        if (old.has(mate.name)) {
                            return old
                        }

                        mate.pos = new Vector(position.x, position.y)
                        const mateMap = new Map(old)
                        mateMap.set(mate.name, mate)
                        return mateMap
                    })
                })

                socket.on('offline', mate => {
                    setMateMapState(old => {
                        const mateMap = new Map(old)
                        mateMap.delete(mate.name)
                        return mateMap
                    })
                })

                socket.on('sync', state => {
                    if (state.name === me.name) {
                        return
                    }

                    setMateMapState(old => {
                        if (old.has(state.name)) {
                            return old
                        }

                        const mateMap = new Map(old)
                        mateMap.set(state.name, state)
                        return mateMap
                    })
                })
            }, [])

            return null
        }

        render(
            <RecoilRoot>
                <RecoilObserver<Map<string, Mate>>
                    atom={mateMapState}
                    onChange={(v: Map<string, Mate>) => {
                        mateMap = v
                    }}
                />
                <TestComponent />
            </RecoilRoot>
        )

        act(() => {
            socketMock.emit('online', {
                name: 'mate1',
                avatar: './avatar.png',
            })
        })

        const onlineMate1 = mateMap.get('mate1')
        expect(onlineMate1).toEqual({
            name: 'mate1',
            avatar: './avatar.png',
            pos: position,
        })

        act(() => {
            socketMock.emit('offline', {
                name: 'mate1',
            })
        })
        const offlineMate1 = mateMap.get('mate1')
        expect(offlineMate1).toBe(undefined)

        act(() => {
            socketMock.emit('sync', {
                name: 'mate2',
                avatar: './avatar.png',
                pos: {
                    x: 50,
                    y: 50,
                },
            })
        })
        const mate2 = mateMap.get('mate2')
        expect(mate2).toEqual({
            name: 'mate2',
            avatar: './avatar.png',
            pos: { x: 50, y: 50 },
        })
    })
})
