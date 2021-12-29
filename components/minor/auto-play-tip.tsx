import { useCallback } from 'react'

import Modal from './modal'

import { useRecoilState } from 'recoil'
import { autoPlayState } from '../../store/atom'

const AutoPlayTip = () => {
    const [autoPlay, setAutoPlayState] = useRecoilState(autoPlayState)

    const closeModal = useCallback(() => {
        setAutoPlayState({
            isAutoplayFailed: false,
        })
    }, [])

    return (
        <Modal isOpen={autoPlay.isAutoplayFailed}>
            <button
                className='px-10 py-5 bg-white rounded text-sm text-green-900'
                onClick={closeModal}
            >
                Click me to resume the audio/video playback
            </button>
        </Modal>
    )
}

export default AutoPlayTip
