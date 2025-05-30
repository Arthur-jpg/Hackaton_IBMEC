import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../components/contexts/authContext'; // ✅ import your auth context

const ProfilePage: React.FC = () => {
  const { userProfile, currentUser } = useAuth(); // ✅ access data from context

  const name = userProfile?.name || '—';
  const major = userProfile?.major || '—';
  const universityId = userProfile?.universityId || '—';
  const email = currentUser?.email || '—';

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Perfil</h1>
      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="mb-4">
          <strong className="block font-medium text-gray-700">Nome:</strong>
          <span>{name}</span>
        </div>
        <div className="mb-4">
          <strong className="block font-medium text-gray-700">Matrícula:</strong>
          <span>{universityId}</span>
        </div>
        <div className="mb-4">
          <strong className="block font-medium text-gray-700">Curso:</strong>
          <span>{major}</span>
        </div>
        <div>
          <strong className="block font-medium text-gray-700">Email:</strong>
          <span>{email}</span>
        </div>
      </div>

      <div className="mt-6">
        <Link to="/dashboard" className="text-blue-500 hover:underline">
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default ProfilePage;
