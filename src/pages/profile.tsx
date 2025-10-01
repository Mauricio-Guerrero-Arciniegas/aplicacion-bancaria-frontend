import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import axiosClient from '../api/axiosClient';
import axios from 'axios';

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
    if (!token) { router.push('/login'); return; }
    const fetchProfile = async () => {
      try {
        const res = await axiosClient.get<UserProfile>('/users/me');
        setProfile(res.data);
      } catch(err: unknown) {
        if (axios.isAxiosError(err)) setMessage(err.response?.data?.message || 'Error al cargar perfil');
      }
    };
    fetchProfile();
  }, [token, router]);

  return (
    <Layout>
      <div className="profile-container">
        <h1>Perfil</h1>
        {profile ? (
          <div>
            <p><strong>Nombre:</strong> {profile.name}</p>
            <p><strong>Email:</strong> {profile.email}</p>
          </div>
        ) : <p>Cargando...</p>}
        {message && <p className="error">{message}</p>}
      </div>
    </Layout>
  );
}