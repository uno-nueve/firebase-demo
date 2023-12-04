import React from 'react'
import { GoogleAuthProvider, onAuthStateChanged, signInWithPopup, getAuth } from "firebase/auth";
import { auth, getUserInfo, registerNewUser, userExists } from "../firebase/firebase";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AuthProvider({children, onUserLoggedIn, onUserNotLoggedIn, onUserNotRegistered}) {
    const navigate = useNavigate()

    useEffect(() => {
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                const isRegistered = await userExists(user.uid)
                if (isRegistered) {
                    console.log("User is registered");
                    const userInfo = await getUserInfo(user.uid)
                    if (userInfo.processCompleted) {
                        console.log('User register process is completed')
                        onUserLoggedIn(userInfo)
                    } else {
                        console.log('User needs to set a username')
                        onUserNotRegistered(userInfo)
                    }
                } else {
                    await registerNewUser({
                        uid: user.uid,
                        displayName: user.displayName,
                        profilePicture: '',
                        username: '',
                        processCompleted: false
                    })
                    console.log("User is not registered");
                    onUserNotRegistered(user)
                }
            } else {
                console.log("No user authenticated");
                onUserNotLoggedIn()
            }
        });
    }, [navigate, onUserLoggedIn, onUserNotLoggedIn, onUserNotRegistered]);

    return (
        <div>{children}</div>
    )
}

