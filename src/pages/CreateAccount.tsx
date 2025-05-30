import React, { useState } from 'react';
import { Navigate, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../components/contexts/authContext';
import { doCreateUserWithEmailAndPassword } from '../components/firebase/auth';
import { getDoc, doc } from 'firebase/firestore';
import { db } from '../components/firebase/firebase';

const Register = () => {
  const navigate = useNavigate();
  const { userLoggedIn, setUserProfile, setCurrentUser } = useAuth(); // ✅ include setters

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [universityId, setUniversityId] = useState('');
  const [major, setMajor] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match');
      return;
    }

    try {
      setIsRegistering(true);
      const user = await doCreateUserWithEmailAndPassword(email, password, {
        name,
        universityId,
        major,
      });

      // ✅ fetch and set userProfile manually
      const userDoc = await getDoc(doc(db, 'id', user.uid));
      if (userDoc.exists()) {
        setCurrentUser(user);
        setUserProfile(userDoc.data());
      }

      navigate('/dashboard');
    } catch (err) {
      setErrorMessage(err.message || 'Something went wrong');
      setIsRegistering(false);
    }
  };

  if (userLoggedIn) return <Navigate to="/dashboard" replace />;

  return (
    <main className="w-full h-screen flex justify-center items-center">
      <div className="w-96 text-gray-600 space-y-5 p-4 shadow-xl border rounded-xl">
        <h3 className="text-center text-xl font-semibold">Create a New Account</h3>
        <form onSubmit={onSubmit} className="space-y-4">
          <Input label="Name" value={name} onChange={setName} />
          <Input label="University ID" value={universityId} onChange={setUniversityId} />
          <Input label="Major" value={major} onChange={setMajor} />
          <Input label="Email" value={email} onChange={setEmail} type="email" />
          <Input label="Password" value={password} onChange={setPassword} type="password" />
          <Input label="Confirm Password" value={confirmPassword} onChange={setConfirmPassword} type="password" />

          {errorMessage && <div className="text-red-600 font-bold">{errorMessage}</div>}

          <button
            type="submit"
            disabled={isRegistering}
            className={`w-full px-4 py-2 text-white font-medium rounded-lg ${
              isRegistering ? 'bg-gray-300' : 'bg-indigo-600 hover:bg-indigo-700'
            }`}
          >
            {isRegistering ? 'Signing Up...' : 'Sign Up'}
          </button>

          <div className="text-sm text-center">
            Already have an account? <Link to="/login" className="font-bold hover:underline">Login</Link>
          </div>
        </form>
      </div>
    </main>
  );
};

// Small reusable input component
const Input = ({
  label,
  value,
  onChange,
  type = 'text',
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
  type?: string;
}) => (
  <div>
    <label className="text-sm text-gray-600 font-bold">{label}</label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      required
      className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg transition duration-300"
    />
  </div>
);

export default Register;
