import '@testing-library/jest-dom/extend-expect'
import { render, waitFor } from '@testing-library/react'
import Guide from '../components/minor/guide'
import { RecoilRoot } from 'recoil'

describe('Guide Component', () => {
    it('Render Component', async () => {
        const { getByText } = render(
            <RecoilRoot>
                <Guide />
            </RecoilRoot>
        )
        const lazyContent = await waitFor(() => getByText(/Virtual HQ/))
        expect(lazyContent).toBeInTheDocument()
    })
})
