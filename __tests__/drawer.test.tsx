import '@testing-library/jest-dom/extend-expect'
import { render, waitFor, queryByAttribute, act } from '@testing-library/react'
import Drawer from '../components/minor/drawer'

describe('Drawer Component', () => {
    const getByStyle = queryByAttribute.bind(null, 'style')

    it('Render Component', async () => {
        const spy = jest.fn()

        const dom = render(
            <Drawer isOpen={true} onClose={spy}>
                <p>drawer</p>
            </Drawer>
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
