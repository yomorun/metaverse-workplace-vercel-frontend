import { useEffect, useCallback } from 'react'
import S from './modal.module.css'

const Modal = ({
    isOpen,
    type = 'modal',
    onClose,
    children,
}: {
    isOpen: boolean
    type?: 'modal' | 'drawer'
    onClose?: () => void
    children: JSX.Element
}) => {
    useEffect(() => {
        if (isOpen) {
            document.body.setAttribute('style', 'overflow: hidden')
        } else {
            document.body.setAttribute('style', 'overflow: auto')
        }
    }, [isOpen])

    const closeModal = useCallback(e => {
        e.preventDefault()
        e.stopPropagation()
        onClose && onClose()
    }, [])

    return (
        <div
            className={S.mask}
            style={{ display: isOpen ? '' : 'none' }}
            onClick={closeModal}
        >
            {
                type === 'modal' ? (
                    <div 
                        className={isOpen ? S.modal : ''}
                        onClick={e => {
                            e.stopPropagation()
                        }}
                    >
                        <div className={S.content}>{children}</div>
                    </div>
                ) : (
                    <div
                        className={`${S.drawer} ${isOpen ? S.openDrawer : ''}`}
                        onClick={e => {
                            e.stopPropagation()
                        }}
                    >
                        {children}
                    </div>
                )
            }
        </div>
    )
}

export default Modal
