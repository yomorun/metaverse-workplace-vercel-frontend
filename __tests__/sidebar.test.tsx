import '@testing-library/jest-dom/extend-expect'
import { render, waitFor } from '@testing-library/react'
import Sidebar from '../components/minor/sidebar'
import { RecoilRoot } from 'recoil'
import { onlineState } from '../store/atom'

describe('Sidebar Component', () => {
    it('Render Component', async () => {
        const initializeState = ({ set }: any) => {
            set(onlineState, true)
        }

        const { getByText } = render(
            <RecoilRoot initializeState={initializeState}>
                <Sidebar />
            </RecoilRoot>
        )

        const lazyContent = await waitFor(() => getByText(/Online/))
        expect(lazyContent).toBeInTheDocument()
    })
})
