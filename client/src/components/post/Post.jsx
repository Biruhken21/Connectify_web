import "./post.css";
import { MoreVert } from "@mui/icons-material";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { format } from "timeago.js";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import {
  FaHandshake,
  FaUserFriends,
  FaHeart,
  FaCommentDots,
} from "react-icons/fa"; // Icons for interactions

export default function Post({ post }) {
  const [like, setLike] = useState(post.likes.length);
  const [isLiked, setIsLiked] = useState(false);
  const [user, setUser] = useState({});
  const [isFollowing, setIsFollowing] = useState(false);
  const [comments, setComments] = useState([]);  // Store fetched comments
  const [newComment, setNewComment] = useState(""); // New comment input
  const [showComments, setShowComments] = useState(false);


  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const { user: currentUser } = useContext(AuthContext);

  useEffect(() => {
    setIsLiked(post.likes.includes(currentUser._id));
  }, [currentUser._id, post.likes]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`/users?userId=${post.userId}`);
        setUser(res.data);
        setIsFollowing(res.data.followers.includes(currentUser._id));
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    };
    fetchUser();
  }, [post.userId, currentUser._id]);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await axios.get(`/posts/${post._id}/comment`);
        setComments(res.data);
      } catch (err) {
        console.error("Error fetching comments:", err);
      }
    };
    fetchComments();
  }, [post._id]);

  const likeHandler = async () => {
    try {
      await axios.put("/posts/" + post._id + "/like", { userId: currentUser._id });
      setLike(isLiked ? like - 1 : like + 1);
      setIsLiked(!isLiked);
    } catch (err) {
      console.error("Error liking post:", err);
    }
  };

  const followHandler = async () => {
    try {
      if (isFollowing) {
        await axios.put(`/users/${user._id}/unfollow`, { userId: currentUser._id });
      } else {
        await axios.put(`/users/${user._id}/follow`, { userId: currentUser._id });
      }
      setIsFollowing(!isFollowing);
    } catch (err) {
      console.error("Error updating follow status:", err);
    }
  };

  const commentHandler = async () => {
    if (!newComment.trim()) return; // Prevent empty comments
    try {
      const res = await axios.post(`/posts/${post._id}/comment`, {
        userId: currentUser._id,
        text: newComment,
      });
      setComments([...comments, res.data]); // Add new comment to the list
      setNewComment(""); // Clear input field
    } catch (err) {
      console.error("Error adding comment:", err);
    }
  };

  return (
    <div className="post">
      <div className="postWrapper">
        {/* Post Top Section */}
        <div className="postTop">
          <div className="postTopLeft">
            <Link to={user?.username ? `/profile/${user.username}` : "/profile/guest"} className="profileLink">
              {user?.profilePicture ? (
                <img className="postProfileImg" src={PF + user.profilePicture} alt={user?.username || "User"} />
              ) : (
                <div className="profilePlaceholder postProfileImg">
                  {user?.username ? user.username.charAt(0).toUpperCase() : "?"}
                </div>
              )}
            </Link>
            <Link to={user?.username ? `/profile/${user.username}` : "/profile/guest"} className="postUserName">
              <span>{user?.username || "Guest"}</span>
            </Link>
            <span className="postDate">{format(post.createdAt)}</span>
          </div>

          {/* Follow/Unfollow Button */}
          <div className="postTopRight">
            {user && user._id !== currentUser._id && (
              <button className={`followButton ${isFollowing ? "unfollow" : "follow"}`} onClick={followHandler}>
                {isFollowing ? "Unfollow" : "Follow"}
              </button>
            )}
            <MoreVert />
          </div>
        </div>

        {/* Media Section */}
        <div className="postCenter">
          <span className="postText">{post?.desc}</span>
          {post.img && <img className="postImg" src={PF + post.img} alt="" />}

          <div className="postActions">
          <button className="postActionButton" onClick={likeHandler}>
            <FaHeart className="postActionIcon" /> Like
          </button>
          <button className="postActionButton">
            <FaHandshake className="postActionIcon" /> Promise
          </button>
          <button className="postActionButton">
            <FaUserFriends className="postActionIcon" /> CoFounder
          </button>
          <button className="postActionButton">
            <FaCommentDots className="postActionIcon" /> Comment
          </button>
        </div>
        </div>

        {/* Interaction Buttons */}
        

        {/* Like & Comment Count */}
        <div className="postBottom">
          <div className="postBottomLeft">
            <img className="likeIcon" src={`${PF}like.png`} onClick={likeHandler} alt="" />
            <img className="likeIcon" src={`${PF}heart.png`} onClick={likeHandler} alt="" />
            <span className="postLikeCounter">{like} people like it</span>
          </div>
          <div className="postBottomRight">
          <span
             className="postCommentText"
             onClick={() => setShowComments(!showComments)}
             style={{ cursor: "pointer" }} 
           >
             {comments.length} comments
           </span>
          </div>
        </div>

        {/* Comment Input Field (Above the Comment List) */}
        <div className="commentSection">
          <input
            type="text"
            className="commentInput"
            placeholder="Write a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <button className="commentButton" onClick={commentHandler}>
            Post
          </button>
        </div>

   {/* Show Comments Only When Clicked */}
   {showComments && (
  <div className="commentList">
    {comments.length > 0 ? (
      comments.map((comment, index) => {
        const username = comment.userId?.username || "Anonymous";
        const profilePicture = comment.userId?.profilePicture;

        return (
          <div key={index} className="comment">
            {/* Profile Picture or Default Initials */}
            <a href={`/profile/${username}`} className="profileLink">
            {profilePicture ? (
              <img
                src={profilePicture}
                alt={username}
                className="commentProfileImg"
              />
            ) : (
              <div className="commentPlaceholder">
                {username.charAt(0).toUpperCase()}
              </div>
            )}
            </a>
            

            {/* User Info & Comment */}
            <div className="commentContent">
              
              <strong>
                <a href={`/profile/${username}`} className="profileLink">
                {username}
                  </a>
                
              </strong>: {comment.text}
              <span className="commentDate">{format(comment.createdAt)}</span>
            </div>
          </div>
        );
      })
    ) : (
      <p>No comments yet.</p>
    )}
  </div>
)}

      </div>
    </div>
  );
}
