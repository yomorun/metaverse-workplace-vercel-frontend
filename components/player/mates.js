import { useRecoilValue } from 'recoil'
import { matesState } from '../../store/selector'
import Mate from './mate'

const Mates = ({ socket }) => {
    const mates = useRecoilValue(matesState)

    return mates.map(m => (
        <Mate
            key={m.name}
            name={m.name}
            avatar={m.avatar}
            initPos={m.pos}
            socket={socket}
        />
    ))
}
export default Mates
