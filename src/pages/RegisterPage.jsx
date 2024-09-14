import * as React  from "react";
import { db, auth } from "./../firebase.js"; // Pastikan auth sudah diekspor dari firebase.js
import {
  collection,
  getDocs,
  addDoc,
  query,
  where
} from "firebase/firestore";
import {
  GoogleAuthProvider,
  signInWithPopup,
  getAuth,
  signInWithRedirect,
  getRedirectResult,
  createUserWithEmailAndPassword
} from "firebase/auth";

/** Fontawesome **/
import { FontAwesomeIcon as Fa } from "@fortawesome/react-fontawesome";
import * as fab from "@fortawesome/free-brands-svg-icons";

import { gRoute } from "./../lib/routes"

import { Link, useNavigate } from "react-router-dom";


export default function RegisterPage() {
  // input variable
  const [email, setEmail] = React.useState("");
  const [pass, setPass] = React.useState("");
  const [name, setName] = React.useState("");
  const nameInputEl = React.useRef(null);
  const emailInputEl = React.useRef(null);
  const passInputEl = React.useRef(null);
  const btnRef = React.useRef(null);
  
  const [users, setUsers] = React.useState([]);
  
  const usersColRef = collection(db, "users");
  const navigate = useNavigate();
  
  const getUsers = async () => {
    const data = await getDocs(usersColRef);
    setUsers(data.docs.map(item => item.data()))
  }
  
  
  /** Default Login **/
  const emailSignin = async () => {
    const validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$/;
    if (!email.match(validRegex)){
      alert("Format email salah!");
      return false;
    } else if (pass == "" || pass == undefined || pass.length <= 0 || pass.length < 6){
      alert("Password kosong dan huruf tidak boleh dibawah 6!");
      return false;
    } else if (name == "" || name == undefined || name.length <= 0){
      alert("Nama tidak boleh kosong!");
      return false;
    }
    
    createUserWithEmailAndPassword(auth, email, pass)
      .then(async (userCred) => {
        const user = userCred.user;
        
        const q = query(collection(db, "users"), where("email", "==", email));
        const docs = await getDocs(q);
        if (docs.docs.length === 0){
          await addDoc(collection(db, "users"), {
            uid: user.uid,
            name: name,
            authProvider: "default:email",
            email: email,
            accessToken: user.accessToken,
            pass: pass,
          });
          setCookie("USERTOKEN", user.accessToken, 7);
          setCookie("USERMAIL", email, 7);
          navigate(gRoute.ROOT);
        }
      })
      .catch((err) => {
        console.error("Error bjir: ", err);
        alert(err.customData._tokenResponse.error.code + " : " + err.customData._tokenResponse.error.message)
      });
  }
  
  
  /** Google Login **/
  const googleSignin = () => {
    const provider = new GoogleAuthProvider();
    provider.addScope('https://www.googleapis.com/auth/contacts.readonly');

    signInWithPopup(auth, provider)  // Gunakan signInWithPopup dari 'firebase/auth'
      .then(async (result) => {
        console.log(result);
        const userUid = result.user.uid;
        const userName = result.user.displayName;
        const userMail = result.user.email;
        const q = query(collection(db, "users"), where("uid", "==", userUid));
        
        const docs = await getDocs(q);
        if (docs.docs.length === 0){
          await addDoc(collection(db, "users"), {
            uid: userUid,
            name: userName,
            authProvider: "google",
            email: userMail,
            accessToken: result.user.accessToken,
            pass: "default"
          });
          setCookie("USERTOKEN", result.user.accesstoken, 7);
          setCookie("USERMAIL", userMail, 7);
          navigate(gRoute.ROOT);
        } else {
          console.log("you login");
          navigate(gRoute.ROOT);
        }
        // console.log(docs);
      })
      .catch((err) => {
        console.error(err);
      });
  }
  
  React.useEffect(() => {
    //  getUsers();
    // console.log(getCookie("USERMAIL"))
    // console.log(getCookie("USERTOKEN"))
  }, []);
  
  
  return (
    <>
      <div className="login-form">
        <h1 className="form-title">Welcome To Our App!</h1>
        <div className="formInput">
          <label htmlFor="name-input" className="label-input"> Nama</label>
          <input ref={nameInputEl} value={name} onChange={() => setName(nameInputEl.current.value)} type="text" id="name-input" className="field-input"/>
          
          <label htmlFor="email-input" className="label-input"> Email</label>
          <input ref={emailInputEl} value={email} onChange={() => setEmail(emailInputEl.current.value)} type="text" id="email-input" className="field-input"/>
          
          <label htmlFor="pass-input" className="label-input"> Password</label>
          <input ref={passInputEl} value={pass} onChange={() => setPass(passInputEl.current.value)} type="text" id="pass-input" className="field-input"/>
          
          <button ref={btnRef} type="button" className="submit-btn" onClick={() => emailSignin()}>Sign In</button>
          
          <div className="alt-login">
            <h1 className="alt-login-title">Atau login lewat</h1>
            <div className="auth-box">
              <button onClick={() => googleSignin()} type="button" id="google-auth-btn" className="auth-btn">
                <Fa icon={fab.faGoogle} />
              </button>
            </div>
          </div>
          <Link to={gRoute.LOGIN} className="change-mode">Sudah memiliki akun?</Link>
        </div>
      </div>
    </>
  );
}


// set cookie func :v
function setCookie(name, value, days) {
  let expires = "";
  if (days) {
    var date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

function getCookie(name) {
  var nameEQ = name + "=";
  var ca = document.cookie.split(';');
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}









// DUMP

// import * as React  from "react";
// import { app, db, auth } from "./../firebase.js";
// import {
//   collection,
//   getDocs,
//   addDoc,
//   updateDoc,
//   deleteDoc,
//   doc,
// } from "firebase/firestore";
// import {
//   getRedirectResult,
//   signInWithRedirect,
//   onAuthStateChanged
// } from "firebase/auth";

// /** Fontawesome **/
// import { FontAwesomeIcon as Fa } from "@fortawesome/react-fontawesome";
// import * as fa from "@fortawesome/free-solid-svg-icons";
// import * as fab from "@fortawesome/free-brands-svg-icons";

// export default function LoginPage() {
//   const btnRef = React.useRef(null);
//   const [users, setUsers] = React.useState([]);
  
//   const usersColRef = collection(db, "users");
  
//   const getUsers = async () => {
//     const data = await getDocs(usersColRef);
//     setUsers(data.docs.map(item => item.data()))
//   }
  
  
//   /** Google Login **/
//   const googleLogin = () => {
//     const provider = new app.auth.GoogleAuthProvider();
//     provider.addScope('https://www.googleapis.com/auth/contacts.readonly');
    
//     firebase.auth()
//       .signInWithPopup(provider)
//         .then((result) => {
//           console.log(reuslt)
//         })
//         .catch((err) => {
//           console.error(err)
//         })
//     /** signInWithRedirect(auth, provider)
//     getRedirectResult(auth)
//       .then((result) => {
//         const credential = GoogleAuthProvider.credentialFromResult(result);
//         const token = credential.accesToken;
//         const user = result.user;
//       })
//       .catch((err) => {
//         const errorCode = error.code;
//         const errorMessage = error.message;
//         // The email of the user's account used.
//         const email = error.customData.email;
//         // The AuthCredential type that was used.
//         const credential = GoogleAuthProvider.credentialFromError(error);
//         console.log(errorMessage);
//       }) **/
//   }
  
//   React.useEffect(() => {
//     getUsers();
//   }, []);
  
//   return (
//     <>
      
//       <div className="login-form">
//         <h1 className="form-title">Welcome Cui!</h1>
//         <div className="formInput">
//           <label htmlFor="name-input" className="label-input"> Nama</label>
//           <input type="text" id="name-input" className="field-input"/>
          
//           <label htmlFor="name-input" className="label-input"> Email</label>
//           <input type="text" id="name-input" className="field-input"/>
          
//           <label htmlFor="pass-input" className="label-input"> Password</label>
//           <input type="text" id="pass-input" className="field-input"/>
          
//           <button ref={btnRef} type="button" className="submit-btn" onClick={() => console.log(user)}>Login</button>
          
//           <div className="alt-login">
//             <h1 className="alt-login-title">Atau login lewat</h1>
//             <div className="auth-box">
//               <button onClick={() => googleLogin()} type="button" id="google-auth-btn" className="auth-btn">
//                 <Fa icon={fab.faGoogle} />
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   )
// }