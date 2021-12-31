import '@testing-library/jest-dom/extend-expect'
import { render, waitFor, queryByAttribute, act } from '@testing-library/react'
import Modal from '../components/minor/modal'

describe('Drawer Component', () => {
    const getByStyle = queryByAttribute.bind(null, 'style')

    it('Render Component', async () => {
        const spy = jest.fn()

        const dom = render(
            <Modal isOpen={true} type='drawer' onClose={spy}>
                <p>drawer</p>
            </Modal>
        )

        const { getByText } = dom

        const lazyContent = await waitFor(() => getByText(/drawer/))
        expect(lazyContent).toBeInTheDocument()

        const component = getByStyle(dom.container, 'visibility: visible;')

        act(() => {
            component?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
        })

        expect(spy).toBeCalled()
    })
})
