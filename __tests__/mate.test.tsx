import '@testing-library/jest-dom/extend-expect'
import { render, act } from '@testing-library/react'
import SocketMock from 'socket.io-mock'
import { RecoilRoot, RecoilState, useRecoilValue } from 'recoil'
import { matePositionMapState } from '../store/atom'
import Mate from '../components/player/mate'
import { useEffect } from 'react'
import type { Position } from '../types'

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

describe('Mate Component', () => {
    let socket: SocketMock

    beforeAll(() => {
        socket = new SocketMock()
    })

    const TestComponent = () => {
        const name = 'TestName'
        const image = './avatar.png'
        const initPos = { x: 30, y: 30 }

        return <Mate name={name} avatar={image} initPos={initPos} socket={socket.socketClient} />
    }

    it('Render Component', () => {
        const { getByText } = render(
            <RecoilRoot>
                <TestComponent />
            </RecoilRoot>
        )

        expect(getByText(/TestName/)).toBeInTheDocument()
    })

    it('Testing mate movement', () => {
        const spy = jest.fn()

        render(
            <RecoilRoot>
                <RecoilObserver<Map<string, Position>>
                    atom={matePositionMapState}
                    onChange={(matePositionMap: Map<string, Position>) => {
                        const matePosition = matePositionMap.get('TestName')
                        spy(matePosition)
                    }}
                />
                <TestComponent />
            </RecoilRoot>
        )

        act(() => {
            socket.emit('movement', {
                name: 'TestName',
                dir: { x: 1, y: 0 },
            })
        })

        expect(spy).toHaveBeenCalledWith({ x: 40, y: 30 })
    })
})
