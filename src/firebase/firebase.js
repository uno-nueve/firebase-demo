import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {
    getStorage,
    ref,
    uploadBytes,
    getDownloadURL,
    getBytes,
} from "firebase/storage";
import {
    getFirestore,
    collection,
    addDoc,
    getDocs,
    doc,
    getDoc,
    query,
    where,
    setDoc,
    deleteDoc,
} from "firebase/firestore";

const apiKey = import.meta.env.VITE_APIKEY;
const authDomain = import.meta.env.VITE_AUTHDOMAIN;
const projectId = import.meta.env.VITE_PROJECTID;
const storageBucket = import.meta.env.VITE_STORAGEBUCKET;
const messagingSenderId = import.meta.env.VITE_MESSAGINGSENDERID;
const appID = import.meta.env.VITE_APPID;

const firebaseConfig = {
    apiKey: apiKey,
    authDomain: authDomain,
    projectId: projectId,
    storageBucket: storageBucket,
    messagingSenderId: messagingSenderId,
    appId: appID,
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export async function userExists(uid) {
    const docRef = doc(db, 'users', uid);
    const res = await getDoc(docRef);
    console.log(res);
    console.log("userExists called with uid:", uid);
    console.log("User data from Firestore:", res.data());
    return res.exists()
}

export async function existsUsername(username) {
    const users = []
    const docsRef = collection(db, 'users')
    const q = query(docsRef, where('username', '==', username))

    const querySnapshot = await getDocs(q)

    querySnapshot.forEach(doc => {
        users.push(doc.data())
    })

    return users.length > 0 ? users[0].uid : null
}

export async function registerNewUser(user) {
    try {
        const collectionRef = collection(db, 'users')
        const docRef = doc(collectionRef, user.uid)
        await setDoc(docRef, user)
    } catch (error) {
        console.error(error)
    }
}

export async function updateUser(user) {
    try {
        // const collectionRef = collection(db, 'users')
        const docRef = doc(db, 'users', user.uid)
        console.log('updateUser data:', user)
        await setDoc(docRef, user)
    } catch (error) {
        console.error(error)
    }
}

export async function getUserInfo(uid) {
    try {
        const docRef = doc(db, 'users', uid)
        const document = await getDoc(docRef)
        return document.data()
    } catch (error) {
        console.error(error)
    }
}

export async function insertNewLink(link) {
    try {
        const docRef = collection(db, 'links')
        const res = await addDoc(docRef, link)
        return res
    } catch (error) {
        console.error(error)
    }
}

export async function getLinks(uid) {
    const links = []
    try {
        const collectionRef = collection(db, 'links')
        const q  = query(collectionRef, where('uid', '==', uid))
        const querySnapshot = await getDocs(q)
        querySnapshot.forEach(doc => {
            const link = {...doc.data()}
            link.docId = doc.id
            links.push(link)
        })
        return links
    } catch (error) {
        console.error(error)
    }
}

export async function updateLink(docId, link) {
    try {
        const docRef = doc(db, 'links', docId)
        const res = await setDoc(docRef, link)
        return res
    } catch (error) {
        console.error(error)
    }
}

export async function deleteLink(docId) {
    try {
        const docRef = doc(db, 'links', docId)
        const res = await deleteDoc(docRef)
        return res
    } catch (error) {
        console.error(error)
    }
}

export async function setUserProfilePhoto(uid, file) {
    try {
        const imageRef = ref(storage, `images/${uid}`)
        const resUpload = await uploadBytes(imageRef, file)
        return resUpload
    } catch (error) {
        console.error(error)
    }
}

export async function getProfilePhotoUrl(profilePicture) {
    try {
        const imageref = ref(storage, profilePicture)
        const url = await getDownloadURL(imageref)
        return url
    } catch (error) {
        console.error(error)
    }
} 

export async function getUserPublicProfileInto(uid) {
    const profileInfo = await getUserInfo(uid)
    const linksInfo = await getLinks(uid)
    return {
        profileInfo: profileInfo,
        linksInfo: linksInfo
    }
}

export async function logout() {
    await auth.signOut()
}