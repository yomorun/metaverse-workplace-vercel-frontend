import { useEffect, useCallback } from 'react'
import S from './drawer.module.css'

export default ({ isOpen, onClose, children }) => {
    useEffect(() => {
        if (isOpen) {
            document.body.style = 'overflow: hidden'
        } else{
            document.body.style = 'overflow: auto'
        }
    }, [isOpen])

    const closeDrawer = useCallback(e => {
        e.preventDefault()
        e.stopPropagation()
        onClose && onClose(e)
    }, [])

    return (
        <div className={S.mask} style={{ visibility: isOpen ? 'visible' : 'hidden' }} onClick={closeDrawer}>
            <div className={`${S.container} ${isOpen ? S.open : ''}`} onClick={e => {e.stopPropagation()}}>
                {children}
            </div>
        </div>
    )
}
