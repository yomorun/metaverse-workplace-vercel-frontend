import '@testing-library/jest-dom/extend-expect'
import { render, waitFor } from '@testing-library/react'
import Modal from '../components/minor/modal'

describe('Drawer Component', () => {
    it('Render Component', async () => {

        const dom = render(
            <Modal isOpen={true} type='drawer'>
                <p>drawer</p>
            </Modal>
        )

        const { getByText } = dom

        const lazyContent = await waitFor(() => getByText(/drawer/))
        expect(lazyContent).toBeInTheDocument()
    })
})
