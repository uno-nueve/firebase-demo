import DashboardWrapper from "../components/DashboardWrapper";
import AuthProvider from "../components/AuthProvider";
import { useNavigate } from "react-router-dom";
import { useRef, useState } from "react";
import { getProfilePhotoUrl, setUserProfilePhoto, updateUser } from "../firebase/firebase";

export default function EditProfileView() {
    const navigate = useNavigate();
    const [state, setState] = useState(0);
    const [currentUser, setCurrentUser] = useState({});
    const [profileUrl, setProfileUrl] = useState({});

    const fileRef = useRef()

    async function handleUserLoggedIn(user) {
        setCurrentUser(user);
        const url = await getProfilePhotoUrl(user.profilePicture)
        setProfileUrl(url)
        setState(2);
    }

    function handleUserNotRegistered(user) {
        navigate("/login");
    }

    function handleUserNotLoggedIn() {
        navigate("/login");
    }

    function handleOpenFilePicker() {
        if (fileRef.current) {
            fileRef.current.click()
        }
        console.log(currentUser)
    }

    function handleChangeFile(e) {
        const files = e.target.files
        const fileReader = new FileReader()

        if (fileReader && files && files.length > 0) {
            fileReader.readAsArrayBuffer(files[0])
            fileReader.onload = async function () {
                const imageData = fileReader.result
                const res = await setUserProfilePhoto(currentUser.uid, imageData)
                console.log(res)
                
                if (res) {
                    const tmpUser = {...currentUser}
                    tmpUser.profilePicture = res.metadata.fullPath
                    await updateUser(tmpUser)
                    setCurrentUser(tmpUser)
                    const url = await getProfilePhotoUrl(currentUser.profilePicture)
                    setProfileUrl(url)
                }
            }
        }
    }

    if (state !== 2) {
        return (
            <AuthProvider
                onUserLoggedIn={handleUserLoggedIn}
                onUserNotLoggedIn={handleUserNotLoggedIn}
                onUserNotRegistered={handleUserNotRegistered}
            />
        )
    }

    console.log(state)

    return (
        <DashboardWrapper>
        <div>
            <h2>Edit Profile Info</h2>
            <div>
                <div>
                    <img src={profileUrl} width={"150px"} />
                </div>
                <div>
                    <button onClick={handleOpenFilePicker}>Choose New Profile Picture</button>
                    <input ref={fileRef} type="file" style={{display:'none'}} onChange={handleChangeFile} />
                </div>
            </div>
        </div>
    </DashboardWrapper>
    );
}
