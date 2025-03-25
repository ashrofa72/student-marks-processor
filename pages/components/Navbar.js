import Link from 'next/link';
import styles from '../../styles/Navbar.module.css';

export default function Navbar() {
  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>
        <h3>برنامج معالجة درجات الامتحان من المنصة</h3>
      </div>
      <ul className={styles.navLinks}>
        <li>
          <Link href="/">الرئيسية</Link>
        </li>
        <li>
          <Link href="/tabledata">الجدول</Link>
        </li>
      </ul>
    </nav>
  );
}