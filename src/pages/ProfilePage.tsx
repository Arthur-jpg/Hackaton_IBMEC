import React from 'react';
import { Link } from 'react-router-dom'; // Import Link if you want to add navigation back

interface Profile {
  nome: string;
  matricula: string;
  curso: string;
  email: string;
}

// Dummy profile data for now - you'll likely fetch this
const studentProfile: Profile = {
  nome: 'Student Full Name',
  matricula: '1234567890',
  curso: 'Computer Science',
  email: 'student@example.com',
};

const ProfilePage: React.FC = () => {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Student Profile</h1>
      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="mb-4">
          <strong className="block font-medium text-gray-700">Nome:</strong>
          <span>{studentProfile.nome}</span>
        </div>
        <div className="mb-4">
          <strong className="block font-medium text-gray-700">Matrícula:</strong>
          <span>{studentProfile.matricula}</span>
        </div>
        <div className="mb-4">
          <strong className="block font-medium text-gray-700">Curso:</strong>
          <span>{studentProfile.curso}</span>
        </div>
        <div>
          <strong className="block font-medium text-gray-700">Email:</strong>
          <span>{studentProfile.email}</span>
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