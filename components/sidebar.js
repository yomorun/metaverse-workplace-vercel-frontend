import Link from 'next/link'
import styles from './sidebar.module.css'

export default function Sidebar({ onlineState, count }) {
    return (
        <nav className={styles.nav}>
            <Link href='https://github.com/yomorun/yomo' >
                <a target='_blank' alt='YoMo Github Repository'>Use [W/A/S/D] control moving</a>
            </Link>
            <span className={onlineState ? styles.online : styles.offline}>{onlineState ? 'Online' : 'Offline'}</span>
            <span>{count}</span>
        </nav>
    )
}
