import * as React from "react";

export default function Posts({ dataPost }){
  // console.log(dataPost)
  return (<div className="post-wrap">
    {
      dataPost.map((post, idx) => {
        return (
          <div className="post" key={idx}>
            <div className="post-head">
              <h1 className="from">{post.from}</h1>
              <p className="time">{
                  post.date && post.date.toDate().toLocaleString()
              }</p>
            </div>
            <div className="post-body">
              <textarea readOnly={true} value={post.post} className="post-text">
              </textarea>
            </div>
            <ul className="post-foot">
              <li className="action-btn">
                <span>Suka</span>
              </li>
              <li className="action-btn">
                <span>Komen</span>
              </li>
              <li className="action-btn">
                <span>Bagikan</span>
              </li>
            </ul>
          </div>
        )
      })
    }
  </div>)
}