import { useCallback } from 'react'

import Modal from './modal'

import { useRecoilState } from 'recoil'
import { tipState } from '../../store/atom'

const Tip = () => {
    const [tip, setTipState] = useRecoilState(tipState)

    const closeModal = useCallback(() => {
        setTipState({
            isOpen: false,
            msg: '',
        })
    }, [])

    return (
        <Modal isOpen={tip.isOpen}>
            <button
                className='px-10 py-5 bg-white rounded text-sm text-green-900'
                onClick={closeModal}
            >
                {tip.msg}
            </button>
        </Modal>
    )
}

export default Tip
