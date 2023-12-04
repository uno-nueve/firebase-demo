import { useNavigate } from 'react-router-dom';
import AuthProvider from '../components/AuthProvider';
import { useState } from 'react';
import { logout } from '../firebase/firebase';

export default function SignOutView() {
    const navigate = useNavigate();
    const [state, setState] = useState(0);


    async function handleUserLoggedIn(user) {
        await logout()
    }

    function handleUserNotRegistered(user) {
        navigate("/login");
    }

    function handleUserNotLoggedIn() {
        navigate("/login");
    }

    return (
        <AuthProvider
        onUserLoggedIn={handleUserLoggedIn}
        onUserNotLoggedIn={handleUserNotLoggedIn}
        onUserNotRegistered={handleUserNotRegistered}
        >
        </AuthProvider>
    )
}