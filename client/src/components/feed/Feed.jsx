import { useContext, useEffect, useState } from "react";
import Post from "../post/Post"
import Share from "../share/Share"
import "./feed.css"
import axios from "axios"
import { AuthContext } from "../../context/AuthContext";

export default function Feed({username}) {

  const [posts, setPosts] = useState([]);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchPosts = async () => {
      if (!user || !user._id) return; // Prevent fetching if user is null
  
      try {
        const res = username
          ? await axios.get("/posts/profile/" + username)
          : await axios.get("posts/timeline/" + user._id);
        setPosts(
          res.data.sort((p1, p2) => new Date(p2.createdAt) - new Date(p1.createdAt))
        );
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };
  
    if (username || user?._id) {
      fetchPosts();
    }
  }, [username, user]); // Removed user._id to avoid accessing it when user is null
  

  return (
    <div className="feed">
      <div className="feedWrapper">
      {(!username || username === user?.username) && <Share />}
        {posts.map((p) => (
          <Post key={p._id} post={p} />
           
        ))}
        
        
      </div>
    </div>
  )
}
