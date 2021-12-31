import Modal from './modal'

import { useRecoilState } from 'recoil'
import { iframePageState } from '../../store/atom'

const IframePage = () => {
    const [IframePage, setIframePageState] = useRecoilState(iframePageState)

    return (
        <Modal
            isOpen={IframePage.isOpen}
            type='drawer'
            onClose={() =>
                setIframePageState({
                    isOpen: false,
                    iframeSrc: '',
                })
            }
        >
            <iframe title='' width='100%' height='100%' src={IframePage.iframeSrc} />
        </Modal>
    )
}

export default IframePage
