import { useRecoilState } from 'recoil'
import { IframePageState } from '../../store/atom'
import Drawer from './drawer'

const IframePage = () => {
    const [IframePage, setIframePageState] = useRecoilState(IframePageState)

    return (
        <Drawer
            isOpen={IframePage.isOpen}
            onClose={() => setIframePageState({
                isOpen: false,
                iframeSrc: ''
            })}
        >
            <iframe
                title=''
                width='100%'
                height='100%'
                src={IframePage.iframeSrc}
            />
        </Drawer>
    )
}

export default IframePage
