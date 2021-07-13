import S from './spin.module.css'

const Spin = () => (
    <svg className={S.circle} width='40' height='40'>
        <circle cx='20' cy='20' r='15' />
    </svg>
)

export default Spin