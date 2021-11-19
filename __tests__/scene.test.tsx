import '@testing-library/jest-dom/extend-expect'
import { render, waitFor } from '@testing-library/react'
import preloadAll from 'jest-next-dynamic'
import { RecoilRoot } from 'recoil'
import { meState } from '../store/atom'
import dynamic from 'next/dynamic'
const Scene = dynamic(() => import('../components/scene'), { ssr: false })

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

describe('Scene Component', () => {
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

    it('Render Component', async () => {
        const initializeState = ({ set }: any) => {
            set(meState, {
                name: 'TestName',
                image: './avatar.png',
            })
        }

        const { getByText } = render(
            <RecoilRoot initializeState={initializeState}>
                <Scene
                    className='w-1800px min-w-1800px h-900px wall'
                    floor='home'
                    backgroundImage='/bg-home.png'
                    boundary={{ top: 0, left: 0, bottom: 900, right: 1800 }}
                    playerInitialPosition={{ x: 30, y: 60 }}
                />
            </RecoilRoot>
        )

        const lazyContent = await waitFor(() => getByText(/TestName/))
        expect(lazyContent).toBeInTheDocument()
    })
})
