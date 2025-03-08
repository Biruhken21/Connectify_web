import "./share.css";
import { Add, EmojiEmotions, Label, PermMedia, Room } from "@mui/icons-material";
import { AuthContext } from "../../context/AuthContext";
import { useContext, useRef, useState } from "react";
import axios from "axios";

export default function Share() {
    const { user } = useContext(AuthContext);
    const PF = process.env.REACT_APP_PUBLIC_FOLDER;
    const desc = useRef();
    const [file, setFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const submitHandler = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        const newPost = {
            userId: user._id,
            desc: desc.current.value,
            img: ""  // This will be updated after the file upload
        };
        
        if (file) {
            const data = new FormData();
            data.append("file", file);
    
            try {
                const uploadRes = await axios.post("/upload", data);
                newPost.img = uploadRes.data.fileName;  // Get the correct filename from the response
            } catch (err) {
                console.log(err);
            }
        }
    
        try {
            await axios.post("/posts", newPost);
            window.location.reload();
        } catch (err) {
            console.log(err);
        } finally {
            setIsLoading(false);
        }
    };
    

    return (
        <div className="share">
            <div className="shareWrapper">
            <div className="shareTop">
    {user ? (
        <>
            {user.profilePicture ? (
                <img
                    className="shareProfileImg"
                    src={PF + user.profilePicture}
                    alt="Profile"
                />
            ) : (
                <div className="profilePlaceholder">
                    {user.username.charAt(0).toUpperCase()}
                </div>
            )}
            <input
                placeholder={`What's a New Idea in Your Mind, ${user.username}?`}
                className="shareInput"
                ref={desc}
            />
        </>
    ) : (
        <p>Loading...</p>
    )}
</div>

                <hr className="shareHr" />
                {file && (
                    <div className="shareImgContainer">
                        <img className="shareImg" src={URL.createObjectURL(file)} alt="" />
                        <button className="shareCancelImg" onClick={() => setFile(null)}>
                            x
                        </button>
                    </div>
                )}
                <form className="shareBottom" onSubmit={submitHandler}>
                    <div className="shareOptions">
                        <label htmlFor="file" className="shareOption">
                            <PermMedia htmlColor="tomato" className="shareIcon" />
                            <span className="shareOptionText">Photo/Video</span>
                            <input
                                style={{ display: "none" }}
                                type="file"
                                id="file"
                                accept=".png,.jpeg,.jpg"
                                onChange={(e) => setFile(e.target.files[0])}
                            />
                        </label>
                        <div className="shareOption">
                            <Label htmlColor="blue" className="shareIcon" />
                            <span className="shareOptionText">Tag</span>
                        </div>
                        <div className="shareOption">
                            <Room htmlColor="green" className="shareIcon" />
                            <span className="shareOptionText">Location</span>
                        </div>
                        <div className="shareOption">
                            <EmojiEmotions htmlColor="goldenrod" className="shareIcon" />
                            <span className="shareOptionText">Feelings</span>
                        </div>
                    </div>
                    <button className="shareButton" type="submit" disabled={isLoading}>
                        {isLoading ? "Posting..." : "Post"}
                    </button>
                </form>
            </div>
        </div>
    );
}