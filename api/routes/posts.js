const router = require("express").Router();
const Post = require("../models/Post");
const User = require("../models/User");


//ceate a post

router.post("/", async (req, res) => {
    const newPost = new Post(req.body)
    try {
        const savedPost = await newPost.save();
        res.status(200).json(savedPost);
    } catch (err) {
        res.status(500).json(err)
    }
})

//update a post

router.put("/:id", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (post.userId === req.body.userId) {
            await post.updateOne({ $set: req.body });
            res.status(200).json("the post has been updated")
        } else {
            res.status(403).json("you can only uppdate your post only")
        }
    } catch (err) {
        res.status(500).json(err);
    }
        
    
});

//delete a post
router.delete("/:id", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (post.userId === req.body.userId) {
            await post.deleteOne();
            res.status(200).json("the post has been deleted")
        } else {
            res.status(403).json("you can only delete your post only")
        }
    } catch (err) {
        res.status(500).json(err);
    }
        
    
});

//like a post

router.put("/:id/like", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if(!post.likes.includes(req.body.userId)) {
            await post.updateOne({ $push: { likes: req.body.userId } });
            res.status(200).json("the post has been liked");
        } else {
            await post.updateOne({ $pull: { likes: req.body.userId } });
            res.status(200).json("The post has been disliked");
        }
    } catch (err) {
        res.status(500).json(err);
    }
});

//get a post

router.get("/:id", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        res.status(200).json(post);
    } catch (err) {
        res.status(500).json(err)
    }
})

//get timeline a post
router.get("/timeline/:userId", async (req, res) => {
    try {
        const currentUser = await User.findById(req.params.userId);
        if (!currentUser) {
            return res.status(404).json({ message: "User not found" });
        }

        const userPosts = await Post.find({ userId: currentUser._id });

        const friendPosts = await Promise.all(
            currentUser.followings?.map(async (friendId) => {
                return await Post.find({ userId: friendId });
            })
        );

        res.status(200).json(userPosts.concat(...friendPosts));
    } catch (err) {
        console.error("Error fetching timeline posts:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// get users all posts

router.get("/profile/:username", async (req, res) => {
    try {
        const user = await User.findOne({ username: req.params.username });
        const posts = await Post.find({ userId: user._id });
        res.status(200).json(posts);
    } catch (err) {
        res.status(500).json(err);
    }
});

    // comments section

    // add a comment for apost
    
    router.post("/:postId/comment", async (req, res) => {
        try {
          const post = await Post.findById(req.params.postId);
          if (!post) return res.status(404).json({ message: "Post not found" });
      
          const newComment = {
            userId: req.body.userId, // ID of the user commenting
            text: req.body.text,
            createdAt: new Date(),
          };
      
          post.comments.push(newComment);
          await post.save();
      
          res.status(200).json(post.comments);
        } catch (err) {
          res.status(500).json(err);
        }
      });

      // get comments of a post

      router.get("/:postId/comment", async (req, res) => {
        try {
            const post = await Post.findById(req.params.postId)
            .populate("comments.userId", "username profilePicture") // Populate username & profilePicture
            .exec();  
          if (!post) return res.status(404).json({ message: "Post not found" });
      
          res.status(200).json(post.comments);
        } catch (err) {
          res.status(500).json(err);
        }
      });

      // delete a comment

      router.delete("/:postId/comment/:commentId", async (req, res) => {
        try {
          const post = await Post.findById(req.params.postId);
          if (!post) return res.status(404).json({ message: "Post not found" });
      
          // Find and remove the comment
          post.comments = post.comments.filter(comment => comment._id.toString() !== req.params.commentId);
          await post.save();
      
          res.status(200).json({ message: "Comment deleted successfully", comments: post.comments });
        } catch (err) {
          res.status(500).json(err);
        }
      });

      // like acomment
      router.put("/:postId/comment/:commentId/like", async (req, res) => {
        try {
          const post = await Post.findById(req.params.postId);
          if (!post) return res.status(404).json({ message: "Post not found" });
      
          const comment = post.comments.find(comment => comment._id.toString() === req.params.commentId);
          if (!comment) return res.status(404).json({ message: "Comment not found" });
      
          // Toggle like
          if (comment.likes.includes(req.body.userId)) {
            comment.likes = comment.likes.filter(id => id !== req.body.userId);
          } else {
            comment.likes.push(req.body.userId);
          }
      
          await post.save();
          res.status(200).json({ message: "Comment liked/unliked", comment });
        } catch (err) {
          res.status(500).json(err);
        }
      });




module.exports = router;