import '@testing-library/jest-dom/extend-expect'
import { render, queryByAttribute, fireEvent, waitFor } from '@testing-library/react'
import { RecoilRoot, useSetRecoilState } from 'recoil'
import { mePositionState, matePositionMapState } from '../store/atom'
import Sound from '../components/rtc/sound'
import { Position } from '../types'

describe('Sound Component', () => {
    const getById = queryByAttribute.bind(null, 'id')

    it('Testing volume variation with distance', async () => {
        const ChangeMePosition = () => {
            const setMePositionState = useSetRecoilState(mePositionState)
            const onChange = (e: React.FormEvent<HTMLInputElement>) => {
                const { value } = e.currentTarget
                const position = JSON.parse(value)
                setMePositionState(position)
            }

            return <input id='ChangeMePosition' value='[{"x": 10, "y": 10}]' onChange={onChange} />
        }

        const initializeState = ({ set }: any) => {
            const matePositionMap = new Map<string, Position>()
            matePositionMap.set('mateId', {
                x: 30,
                y: 30,
            })
            set(matePositionMapState, matePositionMap)
        }

        const dom = render(
            <RecoilRoot initializeState={initializeState}>
                <Sound id='mateId' audioTrack={null} />
                <ChangeMePosition />
            </RecoilRoot>
        )

        const component = getById(dom.container, 'ChangeMePosition')

        fireEvent.change(component as HTMLElement, { target: { value: '{"x": 30, "y": 30}' } })

        expect(await waitFor(() => dom.getByText(/500/))).toBeInTheDocument()

        await new Promise(r => setTimeout(r, 1000))

        fireEvent.change(component as HTMLElement, { target: { value: '{"x": 300, "y": 200}' } })

        expect(await waitFor(() => dom.getByText(/358/))).toBeInTheDocument()

        await new Promise(r => setTimeout(r, 1000))

        fireEvent.change(component as HTMLElement, { target: { value: '{"x": 2000, "y": 2000}' } })

        expect(await waitFor(() => dom.getByText(/0/))).toBeInTheDocument()
    })
})
