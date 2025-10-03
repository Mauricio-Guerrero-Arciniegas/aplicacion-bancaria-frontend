import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import axios from 'axios';
import styles from '../styles/transfer.module.scss';

interface User {
  id: string;
  name: string;
  email: string;
}

export default function Transfer() {
  const { token } = useAuth();
  const router = useRouter();

  const [toUserId, setToUserId] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [balance, setBalance] = useState<number>(0);
  const [userId, setUserId] = useState('');
  const [userName, setUserName] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) {
      router.replace('/login');
      return;
    }
    const fetchProfile = async () => {
      try {
        const res = await axios.get<{
          id: string;
          name: string;
          email: string;
          balance: string;
        }>('http://localhost:3000/api/users/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBalance(Number(res.data.balance));
        setUserId(res.data.id);
        setUserName(res.data.name);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProfile();
  }, [token, router]);

  useEffect(() => {
    if (!userId) return;
    const fetchUsers = async () => {
      try {
        const res = await axios.get<User[]>('http://localhost:3000/api/users', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(res.data.filter(u => u.id !== userId));
      } catch (err) {
        console.error(err);
      }
    };
    fetchUsers();
  }, [token, userId]);

  const handleTransfer = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const numericAmount = Number(amount);
    if (!toUserId) return setMessage('Por favor selecciona un destinatario.');
    if (!numericAmount || numericAmount <= 0) return setMessage('Por favor ingresa un monto mayor a 0.');
    if (numericAmount > balance) return setMessage('No tienes suficiente balance.');

    try {
      setLoading(true);
      await axios.post(
        'http://localhost:3000/api/users/transfer',
        { toUserId, amount: numericAmount, description },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage('Transferencia realizada con éxito');
      setToUserId('');
      setAmount('');
      setDescription('');
      setBalance(prev => prev - numericAmount);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) setMessage(err.response?.data?.message || 'Error al realizar la transferencia');
      else setMessage('Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className={styles.transferContainer}>
        <h1 className={styles.title}>Transferencias</h1>
        <p className={styles.balance}>
          Balance de <strong>{userName}</strong>: ${balance.toFixed(2)}
        </p>

        <form className={styles.form} onSubmit={handleTransfer}>
          <select className={styles.select} value={toUserId} onChange={e => setToUserId(e.target.value)} required>
            <option value="">Selecciona un destinatario</option>
            {users.map(user => (
              <option key={user.id} value={user.id}>
                {user.name} ({user.email})
              </option>
            ))}
          </select>

          <input
            className={styles.inputField}
            type="number"
            placeholder="Monto"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            min="0.01"
            step="0.01"
            required
          />

          <input
            className={styles.inputField}
            type="text"
            placeholder="Descripción (opcional)"
            value={description}
            onChange={e => setDescription(e.target.value)}
          />

          <button className={styles.submitButton} type="submit" disabled={loading}>
            {loading ? 'Enviando...' : 'Enviar'}
          </button>
        </form>

        <button className={styles.backButton} onClick={() => router.push('/dashboard')}>
          Volver al Dashboard
        </button>

        {message && (
          <p className={`${styles.message} ${message.includes('éxito') ? styles.success : styles.error}`}>
            {message}
          </p>
        )}
      </div>
    </Layout>
  );
}