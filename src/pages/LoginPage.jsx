import * as React  from "react";
import { db, auth } from "./../firebase.js"; // Pastikan auth sudah diekspor dari firebase.js
import {
  collection,
  getDocs,
  query,
  addDoc,
  where
} from "firebase/firestore";
import {
  GoogleAuthProvider,
  signInWithPopup,
  getAuth,
  signInWithRedirect,
  onAuthStateChanged,
  signInWithEmailAndPassword
} from "firebase/auth";

/** Fontawesome **/
import { FontAwesomeIcon as Fa } from "@fortawesome/react-fontawesome";
import * as fab from "@fortawesome/free-brands-svg-icons";

import { gRoute } from "./../lib/routes";

import { Link, useNavigate } from "react-router-dom";


export default function LoginPage() {
  // input variable
  const [email, setEmail] = React.useState("");
  const [pass, setPass] = React.useState("");
  const emailInputEl = React.useRef(null);
  const passInputEl = React.useRef(null);
  const btnRef = React.useRef(null);
  
  const [users, setUsers] = React.useState([]);
  
  const usersColRef = collection(db, "users");
  const navigate = useNavigate();
  
  
  // Redirect to profile page
  const redirectHomePage = () => {
    navigate(gRoute.ROOT);
  }
  
  // Quick login function
  const quickLogin = async () => {
    const userMail = getCookie("USERMAIL");
    if (!userMail) {
      console.error("USERMAIL cookie not found or invalid");
      return;
    }
    let q = query(collection(db, "users"), where("email", "==", userMail));
    let docs = await getDocs(q);
    if (!docs.docs.length == 0){
      let data = docs.docs.map(doc => doc.data());
      const _selfToken = getCookie("USERTOKEN");
        console.log(_selfToken)
      if (data[0].accessToken == _selfToken){
        defaultLogin(data[0].email, data[0].pass)
        return;
      }
      console.error("Token tidak sama nih 🤔");
    } else {
      console.log("you dont have an account")
    }
  }
  
  
  const authStateChange = (cookie) => {
    if (cookie) {
      quickLogin();
      return;
    }
    onAuthStateChanged(auth, user => {
      if (user) {
        redirectHomePage()
      } else {
        console.log("there is no user");
      }
    })
  }
  
  
  const getUsers = async () => {
    const data = await getDocs(usersColRef);
    setUsers(data.docs.map(item => item.data()))
  }
  
  
  /** Default Login **/
  const emailLogin = () => {
    const validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$/;
    if (!email.match(validRegex)){
      alert("Format email salah!");
      return false;
    } else if (pass == "" || pass == undefined || pass.length <= 0 || pass.length < 6){
      alert("Password kosong dan huruf tidak boleh dibawah 6!");
      return false;
    }
    
    defaultLogin(email, pass);
  }
  
  
  /** default login **/
  const defaultLogin = (_email, _pass) => {
    signInWithEmailAndPassword(auth, _email, _pass)
      .then(async (cred) => {
        const user = cred.user;
        const q = query(collection(db, "users"), where("email", "==", cred.user.email));
        const docs = await getDocs(q);
        const data = docs.docs.map(doc => doc.data())
        if (data[0].accessToken){
          setCookie("USERMAIL", user.email, 7);
          setCookie("USERTOKEN", data[0].accessToken, 7);
          redirectHomePage();
        } else {
          console.error("accessToken tidak ada / kosong!");
        }
      })
      .catch((err) => {
        console.log(err);
        alert(err.code + ":" + err.message);
      })
  }
  
  
  /** GOOGLE LOGIN **/
  const googleLogin = () => {
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
        console.log("slebew", docs);
        if (docs.docs.length === 0){
          await addDoc(collection(db, "users"), {
            uid: userUid,
            name: userName,
            authProvider: "google",
            email: userMail,
            accessToken: result.user.accessToken,
            pass: "default"
          });
          setCookie("USERTOKEN", result.user.accessToken, 7);
          setCookie("USERMAIL", userMail, 7);
        } else {
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
    authStateChange(getCookie("USERMAIL"));
  }, []);
  
  
  return (
    <>
      <div className="login-form">
        <h1 className="form-title">Welcome To Our App!</h1>
        <div className="formInput">
          <label htmlFor="email-input" className="label-input"> Email</label>
          <input ref={emailInputEl} value={email} onChange={() => setEmail(emailInputEl.current.value)} type="text" id="email-input" className="field-input"/>
          
          <label htmlFor="pass-input" className="label-input"> Password</label>
          <input ref={passInputEl} value={pass} onChange={() => setPass(passInputEl.current.value)} type="text" id="pass-input" className="field-input"/>
          
          <button ref={btnRef} type="button" className="submit-btn" onClick={() => emailLogin()}>Login</button>
          
          <div className="alt-login">
            <h1 className="alt-login-title">Atau login lewat</h1>
            <div className="auth-box">
              <button onClick={() => googleLogin()} type="button" id="google-auth-btn" className="auth-btn">
                <Fa icon={fab.faGoogle} />
              </button>
            </div>
          </div>
          
          <Link to={gRoute.SIGNIN} className="change-mode">Belum memiliki akun?</Link>
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

/*
export default function LoginPage() {
  
}*/