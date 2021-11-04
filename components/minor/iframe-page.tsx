import Drawer from './drawer'

import { useRecoilState } from 'recoil'
import { iframePageState } from '../../store/atom'

const IframePage = () => {
    const [IframePage, setIframePageState] = useRecoilState(iframePageState)

    return (
        <Drawer
            isOpen={IframePage.isOpen}
            onClose={() =>
                setIframePageState({
                    isOpen: false,
                    iframeSrc: '',
                })
            }
        >
            <iframe title='' width='100%' height='100%' src={IframePage.iframeSrc} />
        </Drawer>
    )
}

export default IframePage
