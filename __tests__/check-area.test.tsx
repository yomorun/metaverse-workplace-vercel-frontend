import '@testing-library/jest-dom/extend-expect'
import { render, queryByAttribute, fireEvent } from '@testing-library/react'
import { RecoilRoot, useSetRecoilState } from 'recoil'
import { mePositionState } from '../store/atom'
import CheckArea from '../components/check-area'

describe('CheckArea Component', () => {
    const checkAreaList = [
        {
            id: 'area-1',
            position: {
                x: 60,
                y: 630,
            },
            rectangle: {
                width: 200,
                height: 200,
            },
            iframeSrc: 'https://github.com/yomorun/yomo',
        },
        {
            id: 'area-2',
            position: {
                x: 640,
                y: 80,
            },
            round: {
                diameter: 200,
            },
            iframeSrc: 'https://yomo.run',
        },
    ]

    const getById = queryByAttribute.bind(null, 'id')

    it('Render Component', () => {
        const dom = render(
            <RecoilRoot>
                <CheckArea checkAreaList={checkAreaList} />
            </RecoilRoot>
        )

        const area1 = getById(dom.container, 'area-1')

        expect(area1).toBeInTheDocument()
    })

    it('Testing onEnterCheckArea && onLeaveCheckArea', async () => {
        const onEnterCheckArea = jest.fn()
        const onLeaveCheckArea = jest.fn()

        const ChangeMePosition = () => {
            const setMePositionState = useSetRecoilState(mePositionState)
            const onChange = (e: React.FormEvent<HTMLInputElement>) => {
                const { value } = e.currentTarget
                const position = JSON.parse(value)
                setMePositionState(position)
            }

            return <input id='ChangeMePosition' value='{"x": 10, "y": 10}' onChange={onChange} />
        }

        const dom = render(
            <RecoilRoot>
                <CheckArea
                    checkAreaList={checkAreaList}
                    onEnterCheckArea={onEnterCheckArea}
                    onLeaveCheckArea={onLeaveCheckArea}
                />
                <ChangeMePosition />
            </RecoilRoot>
        )

        const component = getById(dom.container, 'ChangeMePosition')

        fireEvent.change(component as HTMLElement, { target: { value: '{"x": 60, "y": 630}' } })

        expect(onEnterCheckArea).toHaveBeenCalledWith({
            id: 'area-1',
            position: {
                x: 60,
                y: 630,
            },
            rectangle: {
                width: 200,
                height: 200,
            },
            iframeSrc: 'https://github.com/yomorun/yomo',
            entered: true,
        })

        await new Promise(r => setTimeout(r, 1000))

        fireEvent.change(component as HTMLElement, { target: { value: '{"x": 60, "y": 60}' } })

        expect(onLeaveCheckArea).toHaveBeenCalled()
    })
})
