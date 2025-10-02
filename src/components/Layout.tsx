import { ReactNode } from 'react';
import Navbar from './Navbar';
import styles from '../styles/Layout.module.scss';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <Navbar />
      <main className={styles['main-container']}>{children}</main>
    </>
  );
}