// pages/register.tsx
import { useState } from 'react';
import { useRouter } from 'next/router';
import axiosClient from '../api/axiosClient';
import axios from 'axios';

export default function Register() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [balance, setBalance] = useState('0'); // <-- balance como string
  const [message, setMessage] = useState('');

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await axiosClient.post('/api/users/register', {
        name,
        email,
        password,
        balance: Number(balance), // convertimos a número aquí
      });
      setMessage('Usuario registrado correctamente');
      setTimeout(() => router.push('/login'), 1000);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setMessage(err.response?.data?.message || 'Error al registrar usuario');
      } else {
        setMessage('Error desconocido');
      }
    }
  };

  return (
    <div className="form-container">
      <h1>Registrar usuario</h1>
      <form onSubmit={handleRegister}>
        <input
          placeholder="Nombre"
          value={name}
          onChange={e => setName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Correo"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Balance inicial"
          value={balance}
          onChange={e => setBalance(e.target.value)}
          min="0"
          required
        />
        <button type="submit">Registrar</button>
      </form>
      {message && <p>{message}</p>}

      {/* Botón para ir a login */}
      <p style={{ marginTop: '1rem' }}>
        ¿Ya tienes cuenta?{' '}
        <button
          onClick={() => router.push('/login')}
          style={{
            background: 'none',
            border: 'none',
            color: '#0070f3',
            cursor: 'pointer',
            textDecoration: 'underline',
            padding: 0,
          }}
        >
          Iniciar sesión
        </button>
      </p>
    </div>
  );
}