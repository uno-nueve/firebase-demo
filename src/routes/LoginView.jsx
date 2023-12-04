import {
    GoogleAuthProvider,
    onAuthStateChanged,
    signInWithPopup,
} from "firebase/auth";
import { auth, userExists } from "../firebase/firebase";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthProvider from "../components/AuthProvider";

import style from './loginView.module.css';

export default function LoginView() {
    const navigate = useNavigate();
    /*
    State
    0: inicializado
    1: loading
    2: login completo
    3: login sin registro
    4: no hay naide logueado
    5: ya existe el usuario
    6: nuevo username, click para continuar
    7: username no existe
    */
   const [state, setCurrentState] = useState(0);
   // const [currentUser, setCurrentUser] = useState(null);

    async function handleOnClick() {
        const googleProvider = new GoogleAuthProvider();
        await signInWithGoogle(googleProvider);

        async function signInWithGoogle(googleProvider) {
            try {
                const res = await signInWithPopup(auth, googleProvider);
                console.log(res);
            } catch (error) {
                console.error(error);
            }
        }
    }

    // useEffect(() => {
    //     setCurrentState(1);
    //     onAuthStateChanged(auth, async (user) => {
    //         if (user) {
    //             const isRegistered = await userExists(user.uid)

    //             if (isRegistered) {
    //                 navigate('/dashboard')
    //                 setCurrentState(2)
    //             }
    //             navigate('/choose-username')
    //             setCurrentState(3);
    //             console.log(user.displayName);
    //         } else {
    //             setCurrentState(4);
    //             console.log("No hay nadie autenticado...");
    //         }
    //     });
    // }, [navigate]);

    function handleUserLoggedIn(user) {
        navigate('/dashboard')
    }

    function handleUserNotRegistered(user) {
        navigate('/choose-username')
    }
    
    function handleUserNotLoggedIn() {
        setCurrentState(4)
    }

    if (state === 4) {
        return (
            <div className={style.loginView}>
                <div>
                    <h1>Link tree</h1>
                </div>
                <button onClick={handleOnClick} className={style.provider}>Login with Google</button>
            </div>
        );
    }

    if (state === 5) {
        return (
            <div>
                <button onClick={handleOnClick}>Login with Google</button>
            </div>
        );
    }

    return (
        <AuthProvider
            onUserLoggedIn={handleUserLoggedIn}
            onUserNotLoggedIn={handleUserNotLoggedIn}
            onUserNotRegistered={handleUserNotRegistered}
        >
            <div>Loading...</div>
        </AuthProvider>
    );
}
