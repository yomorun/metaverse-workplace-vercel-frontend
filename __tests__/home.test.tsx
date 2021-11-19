import '@testing-library/jest-dom/extend-expect'
import { render, waitFor } from '@testing-library/react'
import preloadAll from 'jest-next-dynamic'
import { RecoilRoot } from 'recoil'
import { meState } from '../store/atom'
import Home from '../pages/index'

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

describe('Home page', () => {
    beforeAll(() => {
        global.ImageData = jest.fn()

        Object.defineProperty(global.navigator, 'mediaDevices', {
            value: {
                enumerateDevices: jest.fn(() => {
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

    const initializeState = ({ set }: any) => {
        set(meState, {
            name: 'TestName',
            image: './avatar.png',
        })
    }

    it('Render page', async () => {
        const { getByText } = render(
            <RecoilRoot initializeState={initializeState}>
                <Home country='' region='' />
            </RecoilRoot>
        )

        const lazyContent = await waitFor(() => getByText(/TestName/))
        expect(lazyContent).toBeInTheDocument()
    })
})
