import * as React  from "react";
import { db, auth, app} from "./../firebase.js"; // Pastikan auth sudah diekspor dari firebase.js
import {
  collection,
  getDocs,
  addDoc,
  query,
  where,
  onSnapshot,
  doc,
  orderBy
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

import { Link, useNavigate } from "react-router-dom";
import { gRoute } from "./../lib/routes";

import PostForm from "./../components/PostForm";
import Posts from "./../components/Posts";


export default function HomePage(){
  const [isLogin, setIsLogin] = React.useState(false);
  const [orderPosts, setOrderPosts] = React.useState(true);
  const [postsHasLoaded, setpostsHasLoaded] = React.useState(false);
  const [postsRef, setPostsRef] = React.useState([]);
  const [posts, setPosts] = React.useState([]);
  const navigate = useNavigate();
  const postboxel = React.useRef(null);
  const orderBtnEl = React.useRef(null);
  
  
  const checkUserAcc = () => {
    onAuthStateChanged(auth, user => {
      if (user){
        setIsLogin(true);
        // console.log(user)
      } else {
        setIsLogin(false);
      }
    });
  }
  
  const renderPosts = async () => {
    const postsColRef = await collection(db, 'posts');
    setPostsRef(postsColRef);
  }
  
  const changeOrder = () => {
    let thisOrderVal = orderBtnEl.current.value;
    setOrderPosts(!!thisOrderVal);
  }
  
  React.useEffect(() => {
    if (postsRef.length <= 0) return;
    // let postDat = [];
    let orderVal = orderPosts ? "desc" : "asc";
    const q = query(postsRef, orderBy("date", orderVal));
    const unsub = onSnapshot(q, (ss) => {
      const newData = ss.docs.map(doc => ({
        collection_id: doc.id,
        ...doc.data()
      }));
      setPosts(newData);
    })
    // console.log(postDat);
    /* postsRef.docs.map(doc => {
      postDat.push(doc.data());
      
      setPosts(postDat);
    }) */
    // setpostsHasLoaded(true)
    // console.log(posts)
  }, [postsRef, orderPosts])
  
  React.useEffect(() => {
    if (posts.length <= 0) return;
    // if (posts[0].date)
    setpostsHasLoaded(true);
  }, [posts]);
  
  React.useEffect(() => {
    checkUserAcc();
    renderPosts();
    // console.log(postboxel.current)
  }, []);
  
  /* const unsub = onSnapshot(
    doc(db, "posts", "name"),
    (docSnap) => {
      setPosts(docSnap);
    }
  ) */
  
  return (
    <>
      <div className="home">
        <div ref={postboxel}>
          { isLogin ? <PostForm /> : <MakeAccHook /> }
        </div>
        <div className="container">
          <div className="posts">
            <select ref={orderBtnEl} className="filter-btn" onChange={() => {changeOrder()}}>
              <option value="1">Now</option>
              <option value="">Last</option>
            </select>
            <div className="post-box">
              {/* Posts */}
              {
                posts && <Posts dataPost={posts} />
              }
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

/** MAKE ACCOUNT HOOK **/
function MakeAccHook(){
  return (
    <div className="postform container">
      <Link className="postform-title _notLogin" to={gRoute.SIGNIN}>
        Let's make your first account!
      </Link>
    </div>
  )
}