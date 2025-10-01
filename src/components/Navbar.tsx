import Link from 'next/link';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { token, logout } = useAuth();

  return (
    <nav className="navbar">
      <Link href="/dashboard">Dashboard</Link>
      <Link href="/transfer">Transferencias</Link>
      <Link href="/profile">Perfil</Link>
      {token && <button onClick={logout}>Logout</button>}
    </nav>
  );
}