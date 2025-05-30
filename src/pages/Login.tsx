import React, { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { doSignInWithEmailAndPassword } from '../components/firebase/auth';
import { useAuth } from '../components/contexts/authContext';

const Login = () => {
 const navigate = useNavigate();
 const { userLoggedIn } = useAuth();

 const [email, setEmail] = useState('');
 const [password, setPassword] = useState('');
 const [isLoggingIn, setIsLoggingIn] = useState(false);
 const [errorMessage, setErrorMessage] = useState('');

 const onSubmit = async (e) => {
   e.preventDefault();
   setErrorMessage('');
   setIsLoggingIn(true);
   try {
     await doSignInWithEmailAndPassword(email, password);
     navigate('/dashboard');
   } catch (error) {
     setErrorMessage(error.message);
     setIsLoggingIn(false);
   }
 };

 if (userLoggedIn) {
   return <Navigate to="/dashboard" replace />;
 }

 return (
   <main className="w-full h-screen flex items-center justify-center">
     <div className="w-96 text-gray-600 space-y-5 p-6 shadow-xl border rounded-xl bg-white">
       <div className="text-center mb-6">
         <img src="/logo.png" alt="Logo" className="mx-auto mb-4 h-48" /> {/* Increased height to h-24 */}
         <h3 className="text-2xl font-semibold text-gray-800">Login to Your Account</h3>
       </div>
       <form onSubmit={onSubmit} className="space-y-4">
         <div>
           <label className="text-sm font-bold text-gray-600">Email</label>
           <input
             type="email"
             autoComplete="email"
             required
             value={email}
             onChange={(e) => setEmail(e.target.value)}
             className="w-full mt-2 px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
           />
         </div>
         <div>
           <label className="text-sm font-bold text-gray-600">Password</label>
           <input
             type="password"
             autoComplete="current-password"
             required
             value={password}
             onChange={(e) => setPassword(e.target.value)}
             className="w-full mt-2 px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
           />
         </div>
         {errorMessage && (
           <p className="text-sm text-red-600 font-semibold">{errorMessage}</p>
         )}
         <button
           type="submit"
           disabled={isLoggingIn}
           className={`w-full py-2 text-white font-medium rounded-lg ${
             isLoggingIn
               ? 'bg-gray-400 cursor-not-allowed'
               : 'bg-indigo-600 hover:bg-indigo-700 transition'
           }`}
         >
           {isLoggingIn ? 'Logging in...' : 'Login'}
         </button>
         <div className="text-sm text-center">
           Don’t have an account?{' '}
           <Link to="/create-account" className="font-bold text-indigo-600 hover:underline">
             Register
           </Link>
         </div>
       </form>
     </div>
   </main>
 );
};

export default Login;