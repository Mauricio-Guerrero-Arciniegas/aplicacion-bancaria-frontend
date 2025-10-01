import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/router';
import axios from 'axios';
import Layout from '../components/Layout';

interface Transaction {
  id: string;
  amount: number; // ahora será número
  date: string;
  type: string;
  description?: string;
}

export default function Dashboard() {
  const { token, logout } = useAuth();
  const router = useRouter();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [balance, setBalance] = useState<number>(0);
  const [userName, setUserName] = useState('');

  // Traer perfil y balance
  useEffect(() => {
    if (!token) {
      router.push('/login');
      return;
    }

    const fetchProfile = async () => {
      try {
        const res = await axios.get<{
          id: string;
          name: string;
          balance: string;
        }>('http://localhost:3000/api/users/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBalance(Number(res.data.balance));
        setUserName(res.data.name);
      } catch (err) {
        console.error(err);
      }
    };

    fetchProfile();
  }, [token, router]);

  // Traer transacciones
  useEffect(() => {
    if (!token) return;

    const fetchTransactions = async () => {
      try {
        const res = await axios.get<Transaction[]>('http://localhost:3000/api/users/transactions', {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Convertimos amount a número
        const transactionsNumeric = res.data.map(t => ({
          ...t,
          amount: Number(t.amount)
        }));

        setTransactions(transactionsNumeric);
      } catch (err) {
        console.error(err);
      }
    };

    fetchTransactions();
  }, [token]);

  return (
    <Layout>
      <div className="container">
        <h1>Dashboard</h1>
        <button onClick={() => { logout(); router.push('/login'); }}>Cerrar sesión</button>
        <button onClick={() => router.push('/transfer')} style={{ marginLeft: '10px' }}>
          Hacer transferencia
        </button>
        <p>
          Balance de <strong>{userName}</strong>: ${balance.toFixed(2)}
        </p>
        <h2>Últimas transacciones</h2>
        {transactions.length === 0 ? (
          <p>No hay transacciones</p>
        ) : (
          <ul>
            {transactions.map(t => (
              <li key={t.id}>
                {t.date} - {t.type} - ${t.amount.toFixed(2)}
                {t.description && ` - ${t.description}`}
              </li>
            ))}
          </ul>
        )}
      </div>
    </Layout>
  );
}