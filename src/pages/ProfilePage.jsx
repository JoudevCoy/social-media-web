import * as React from "react";
import { db, auth } from "./../firebase.js"
import {
  collection,
  getDocs,
  addDoc,
  query,
  where
} from "firebase/firestore";
import {
  onAuthStateChanged,
  signOut
} from "firebase/auth";

import { useNavigate } from "react-router-dom";
import { gRoute } from "./../lib/routes";

export default function ProfilePage(){
  const navigate = useNavigate();
  
  /** Sign Out Account **/
  const signOutAcc = () => {
    signOut(auth)
      .then(() => {
        console.log("successfull!");
        eraseCookie("USERMAIL"); eraseCookie("USERTOKEN");
        navigate(gRoute.LOGIN);
        })
      .catch(err => alert(err))
  }
  
  
  /** Check if the user logged in **/
  const checkIfLogged = () => {
    onAuthStateChanged(auth, user => {
      if (user == null){
        console.log("kamu sudah keluar!")
        return;
      }
      console.log(user);
    });
  }
  
  /** Display the posts **/
  React.useEffect(() => {
    checkIfLogged();
  });
  
  
  return (
    <>
      <div className="profile-page">
        <button onClick={() => signOutAcc()}>Sign Out</button>
      </div>
    </>
  )
}

function eraseCookie(name) {   
  document.cookie = name +'=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}