import '@testing-library/jest-dom/extend-expect'
import { render, waitFor } from '@testing-library/react'
import preloadAll from 'jest-next-dynamic'
import { RecoilRoot } from 'recoil'
import dynamic from 'next/dynamic'

describe('Webcam Component', () => {
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
        const Webcam = dynamic(() => import('../components/rtc/webcam'), { ssr: false })
        return <Webcam cover='./avatar.png' name='name' channel='home' />
    }

    it('Render Component', async () => {
        const { getByAltText } = render(
            <RecoilRoot>
                <TestComponent />
            </RecoilRoot>
        )

        const lazyContent = await waitFor(() => getByAltText(/me-avatar/))
        expect(lazyContent).toBeInTheDocument()
    })
})
