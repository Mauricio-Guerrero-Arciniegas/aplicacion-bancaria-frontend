import { useState } from 'react';
import { useRouter } from 'next/router';
import axiosClient from '../api/axiosClient';
import { useAuth } from '../context/AuthContext';

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
      setToken(res.data.access_token); // token según tu backend
      router.push('/dashboard');
    } catch {
      setError('Credenciales inválidas');
    }
  };

  return (
    <div className="form-container">
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <input type="email" placeholder="Correo" value={email} onChange={e => setEmail(e.target.value)} required />
        <input type="password" placeholder="Contraseña" value={password} onChange={e => setPassword(e.target.value)} required />
        <button type="submit">Ingresar</button>
      </form>

      {error && <p>{error}</p>}

      {/* Botón para registrar un nuevo usuario */}
      <p style={{ marginTop: '1rem' }}>
        Registrar otro Usuario{' '}
        <button 
          onClick={() => router.push('/register')} 
          style={{
            background: 'none',
            border: 'none',
            color: '#0070f3',
            cursor: 'pointer',
            textDecoration: 'underline',
            padding: 0,
          }}
        >
          Registrar
        </button>
      </p>
    </div>
  );
}