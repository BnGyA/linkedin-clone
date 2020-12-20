import SubscriptionsIcon from '@material-ui/icons/Subscriptions'
import CreateIcon from '@material-ui/icons/Create'
import ImageIcon from '@material-ui/icons/Image'
import EventNoteIcon from '@material-ui/icons/EventNote'
import CalendarViewDayIcon from '@material-ui/icons/CalendarViewDay'

import React, {useState, useEffect} from 'react'
import './Feed.css'
import InputOption from './InputOption'
import Post from './Post'
import {db} from './firebase'
import firebase from 'firebase'
import { useSelector } from 'react-redux'
import { selectUser } from './features/userSlice'
function Feed() {

    const user = useSelector(selectUser);
    const [input, setInput] = useState('');
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        
        db.collection('posts').orderBy('timestamp', 'desc').onSnapshot((snapshot) =>
        
            setPosts(
                snapshot.docs.map((doc) => ({
                    id: doc.id,
                    data: doc.data()
                }))
            )
        );
    }, [])

    const sendPost = (e) =>{
        e.preventDefault();

        db.collection('posts').add({
            name: user.displayName,
            description: user.email,
            message: input,
            photoUrl: user.photoUrl || '',
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        })

        setInput('')
    } 

    return (
        <div className="feed">
            <div className="feed__inputContainer">
                <div className="feed__input">
                    <CreateIcon />
                    <form>
                        <input type="text" value={input} onChange={e => setInput(e.target.value)}/>
                        <button type="submit" onClick={sendPost}>Send</button>
                    </form>
                </div>

                <div className="feed__inputOptions">
                    <InputOption Icon={ImageIcon} title="Photo" color="#70b5f9"/>
                    <InputOption Icon={SubscriptionsIcon} title="Photo" color="#e7a33e"/>
                    <InputOption Icon={EventNoteIcon} title="Photo" color="#c0cbcd"/>
                    <InputOption Icon={CalendarViewDayIcon} title="Photo" color="#7fc15e"/>
                </div>
            </div>

            {posts.map(({id, data: {name, description, message, photoUrl}}) => (
                <Post key={id} name={name} description={description} message={message}/>
            ))}
        </div>
    )
}

export default Feed
