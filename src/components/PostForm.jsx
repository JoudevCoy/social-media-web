import * as React from "react";
import { db, auth } from "./../firebase.js";
import {
  collection,
  getDocs,
  addDoc,
  query,
  where,
  serverTimestamp
} from "firebase/firestore"
import { onAuthStateChanged } from "firebase/auth";
import { gRoute } from "./../lib/routes";
import uuid from "react-uuid";

import { Link } from "react-router-dom";

export default function PostForm(){
  const inputRef = React.useRef(null);
  const [postVal, setPostVal] = React.useState("");
  const [isLogin, setIsLogin] = React.useState(false);
  const [username, setUsername] = React.useState("");
  const [useruid, setUseruid] = React.useState("");
  
  
  const checkUserAcc = async () => {
    onAuthStateChanged(auth, user => {
      if (user){
        setIsLogin(true);
        getUser(user);
      } else {
        setIsLogin(false);
      }
    })
  }
  
  const getUser = async (_user) => {
    const usrUid = _user.uid;
    const q = query(collection(db, "users"), where("uid", "==", usrUid));
    const docs = await getDocs(q);
    const usrDat = docs.docs.map(doc => doc.data());
    if (usrDat[0].uid == usrUid){
      setUsername(usrDat[0].name);
      setUseruid(usrUid);
    } else {
      console.error("Something went error!")
    }
  }
  
  
  const posting = async () => {
    if (postVal.length >= 200){
      alert("Teksnya panjang bnget cokk, mau bikin ngelag database gw?!?!?");
      return;
    };
    const isValidPostVal = /^[\n\s]*$/.test(postVal);
    if (isValidPostVal ){
      alert("Teks tidak valid");
      return;
    }
    try {
      
      let POSTID = useruid,
        POSTTIMESTAMP = serverTimestamp(),
        POSTFROM = username,
        POSTUUID = uuid(),
        POSTBODY = postVal,
        POSTIMG = "";
      
      await addDoc(collection(db, "posts"), {
        date: POSTTIMESTAMP,
        from: POSTFROM,
        img: POSTIMG,
        post: POSTBODY,
        postId: POSTID,
        uid: POSTUUID
      });
      setPostVal("")
    } catch(err) {
      console.error("Error post: ", err);
    }
  }
  
  
  React.useEffect(() => {
    checkUserAcc();
  }, []);
  
  /** Post Form **/
  return (
    <div className="postform container">
      <h1 className="postform-title">lets make your first post!</h1>
      <div className="form">
        <span className="name">{username}</span>
        <textarea placeholder="post your inspiration!" ref={inputRef} value={postVal} onChange={() => setPostVal(inputRef.current.value)} row="1" col="1" className="input" />
        <button className="post-btn" type="button" onClick={() => { posting() }} >Post</button>
      </div>
    </div>
  )
}