import Link from 'next/link';
import styles from '../../styles/Navbar.module.css';

export default function Navbar() {
  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>
        <h1>برنامج معالجة درجات الامتحان</h1>
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