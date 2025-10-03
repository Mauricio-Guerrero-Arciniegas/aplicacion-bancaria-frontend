import { useState } from 'react';
import { useRouter } from 'next/router';
import axiosClient from '../api/axiosClient';
import axios from 'axios';
import styles from '../styles/register.module.scss';

export default function Register() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [balance, setBalance] = useState('');
  const [message, setMessage] = useState('');

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await axiosClient.post('/api/users/register', {
        name,
        email,
        password,
        balance: Number(balance),
      });
      setMessage('✅ Usuario registrado correctamente');
      setTimeout(() => router.push('/login'), 1000);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setMessage(err.response?.data?.message || '❌ Error al registrar usuario');
      } else {
        setMessage('⚠️ Error desconocido');
      }
    }
  };

  return (
    <div className={styles.screen}>
      <div className={styles.panel}>
        <h1>Registro de Usuario</h1>
        <form onSubmit={handleRegister} className={styles.form}>
          <input placeholder="Nombre" value={name} onChange={e => setName(e.target.value)} required />
          <input type="email" placeholder="Correo" value={email} onChange={e => setEmail(e.target.value)} required />
          <input type="password" placeholder="Contraseña" value={password} onChange={e => setPassword(e.target.value)} required />
          <input type="number" placeholder="Balance inicial" value={balance} onChange={e => setBalance(e.target.value)} min="0" required />
          <button type="submit">Registrar</button>
        </form>

        {message && <p className={styles.message}>{message}</p>}

        <p className={styles.loginText}>
          ¿Ya tienes cuenta?{' '}
          <button onClick={() => router.push('/login')} className={styles.linkBtn}>
            Iniciar sesión
          </button>
        </p>
      </div>
    </div>
  );
}