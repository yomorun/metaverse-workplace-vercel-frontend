import { useEffect, useCallback } from 'react'
import S from './drawer.module.css'

type Props = {
    isOpen: boolean
    onClose: () => void
    children: JSX.Element
}

const Drawer = ({ isOpen, onClose, children }: Props) => {
    useEffect(() => {
        if (isOpen) {
            document.body.setAttribute('style', 'overflow: hidden')
        } else {
            document.body.setAttribute('style', 'overflow: auto')
        }
    }, [isOpen])

    const closeDrawer = useCallback(e => {
        e.preventDefault()
        e.stopPropagation()
        onClose && onClose()
    }, [])

    return (
        <div
            className={S.mask}
            style={{ visibility: isOpen ? 'visible' : 'hidden' }}
            onClick={closeDrawer}
        >
            <div
                className={`${S.container} ${isOpen ? S.open : ''}`}
                onClick={e => {
                    e.stopPropagation()
                }}
            >
                {children}
            </div>
        </div>
    )
}

export default Drawer
