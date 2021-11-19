import '@testing-library/jest-dom/extend-expect'
import { render, waitFor } from '@testing-library/react'
import FloorLinks from '../components/minor/floor-links'

describe('FloorLinks Component', () => {
    it('Render Component', async () => {
        const { getByText } = render(<FloorLinks />)

        const lazyContent = await waitFor(() => getByText(/1/))
        expect(lazyContent).toBeInTheDocument()
    })
})
