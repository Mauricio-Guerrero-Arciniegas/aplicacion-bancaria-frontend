import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import axiosClient from '../api/axiosClient';
import axios from 'axios';
import styles from '../styles/profile.module.scss';

interface UserProfile {
  id: string;
  name: string;
  email: string;
}

export default function Profile() {
  const { token } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) { 
      router.push('/login'); 
      return; 
    }

    const fetchProfile = async () => {
      try {
        const res = await axiosClient.get<UserProfile>('/api/users/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(res.data);
      } catch(err: unknown) {
        if (axios.isAxiosError(err)) 
          setMessage(err.response?.data?.message || 'Error al cargar perfil');
      }
    };

    fetchProfile();
  }, [token, router]);

  return (
    <Layout>
      <div className={styles.profileContainer}>
        <h1 className={styles.title}>Perfil</h1>

        {profile ? (
          <div className={styles.panel}>
            <p><strong>Nombre:</strong> {profile.name}</p>
            <p><strong>Email:</strong> {profile.email}</p>
          </div>
        ) : (
          <p className={styles.loading}>Cargando...</p>
        )}

        {message && <p className={styles.error}>{message}</p>}

        <button 
          className={styles.backButton}
          onClick={() => router.push('/dashboard')}
        >
          Volver al Dashboard
        </button>
      </div>
    </Layout>
  );
}