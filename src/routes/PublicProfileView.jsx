import { useState, useEffect } from "react";
import { useParams } from "react-router-dom"
import { existsUsername, getProfilePhotoUrl, getUserPublicProfileInto } from "../firebase/firebase";
import PublicLink from '../components/PublicLink';

export default function PublicProfileView() {
    const params = useParams()
    const [profile, setProfile] = useState(null);
    const [url, setUrl] = useState('');
    const [state, setState] = useState(0);

    useEffect( () => {
        getProfile()

        async function getProfile() {
            const username = params.username

            try {
                const userUid = await existsUsername(username)

                if (userUid) {
                    const userInfo = await getUserPublicProfileInto(userUid)
                    setProfile(userInfo)
                    const url = await getProfilePhotoUrl(userInfo.profileInfo.profilePicture)
                    setUrl(url)
                } else {
                    setState(7)
                }
            } catch (error) {
                console.error(error)
            }
        }
    }, [params]);

    if (state === 7) {
        return (
            <div>
                <h1>Username doesn&#39;t exists</h1>
            </div>
        )
    }

    return (
        <div>
            <div>
                <img src={url} />
            </div>
            <h2>{profile?.profileInfo.username}</h2>
            <h3>{profile?.profileInfo.displayName}</h3>
            <div>
                {profile?.linksInfo.map((link) => (
                    <PublicLink key={link.docId} url={link.url} title={link.title} />
                ))}
            </div>
        </div>
    )
}