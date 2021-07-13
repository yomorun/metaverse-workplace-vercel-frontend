import Link from 'next/link'
import styles from './sidebar.module.css'

export default function Sidebar({ onlineState, count }) {
  return (
    <nav className={styles.nav}>
      {/* <input placeholder="Type name"></input>
      <button style={{ backgroundColor: 'blue', color: 'white' }} onClick={{ changeState }}>Go Online!</button> */}
      <Link href="https://github.com/yomorun/yomo" >
        <a target="_blank" alt="YoMo Github Repository">YoMo</a>
      </Link>
      <span className={ onlineState ? styles.online : styles.offline }>{ onlineState ? "Online" : "Offline" }</span>
      <span>{ count }</span>
    </nav>
  )
}