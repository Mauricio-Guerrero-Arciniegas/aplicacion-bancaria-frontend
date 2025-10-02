import { useState } from 'react';
import { useRouter } from 'next/router';
import axiosClient from '../api/axiosClient';
import { useAuth } from '../context/AuthContext';
import styles from '../styles/login.module.scss';
import Layout from '@/components/Layout';

export default function LoginPage() {
  const router = useRouter();
  const { setToken } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await axiosClient.post('/api/users/login', { email, password });
      setToken(res.data.access_token); 
      router.push('/dashboard');
    } catch {
      setError('Credenciales inválidas');
    }
  };

  return (
    <Layout>  
    <div className={styles['form-container']}>
  <h1>Login</h1>
  <form onSubmit={handleSubmit} className={styles.form}>
    <input type="email" placeholder="Correo" value={email} onChange={e => setEmail(e.target.value)} required />
    <input type="password" placeholder="Contraseña" value={password} onChange={e => setPassword(e.target.value)} required />
    <button type="submit">Ingresar</button>
  </form>

  {error && <p className={styles.error}>{error}</p>}

  <p>
    Registrar otro Usuario{' '}
    <button onClick={() => router.push('/register')}>Registrar</button>
  </p>
</div>
</Layout>
  );
}