import '@testing-library/jest-dom/extend-expect'
import { queryByAttribute, render } from '@testing-library/react'
import IframePage from '../components/minor/iframe-page'
import { RecoilRoot } from 'recoil'
import { iframePageState } from '../store/atom'

describe('IframePage Component', () => {
    const getBySrc = queryByAttribute.bind(null, 'src')

    it('Render Component', async () => {
        const initializeState = ({ set }: any) => {
            set(iframePageState, {
                isOpen: true,
                iframeSrc: 'https://yomo.run',
            })
        }

        const dom = render(
            <RecoilRoot initializeState={initializeState}>
                <IframePage />
            </RecoilRoot>
        )

        const component = getBySrc(dom.container, 'https://yomo.run')

        expect(component).toBeInTheDocument()
    })
})
