const User = require("../models/User");
const router = require("express").Router();
const bcrypt = require("bcryptjs")



//update user
router.put("/:id", async (req, res) => {
    if (req.body.userId === req.params.id || req.body.isAdmin) {
        if (req.body.password) {
            try {
                const salt = await bcrypt.genSalt(10);
                req.body.password = await bcrypt.hash(req.body.password, salt)
            } catch (err) {
                return res.status(500).json(err);
            }
        }

        try {
            const user = await User.findByIdAndUpdate(req.params.id, {
                $set: req.body,
            });
            res.status(200).json("Account has been updated")
        } catch (err) {
            return res.status(500).json(err);
        }
    } else {
        return res.status(403).json("you can update your account");
    }
});


//delete user
router.delete("/:id", async (req, res) => {
    if (req.body.userId === req.params.id || req.body.isAdmin) {
       
        try {
            const user = await User.findByIdAndDelete(req.params.id);
            res.status(200).json("Account has been deleted");
        } catch (err) {
            return res.status(500).json(err);
        }
    } else {
        return res.status(403).json("you can delete your account");
    }
});

//get a user with id and user name without using any paramters 

router.get("/", async (req, res) => {
    const userId = req.query.userId;
    const username = req.query.username;
    try {
        const user = userId
            ? await User.findById(userId)
            : await User.findOne({ username });
        // used to excluded unwanted user information
        const { password, updatedAt, ...other } = user._doc
        res.status(200).json(other)
    } catch (err) {
        res.status(500).json(err)
    }
});

//get friends
router.get("/friends/:userId", async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        const friends = await Promise.all(
            user.followings.map(friendId => {
                return User.findById(friendId)
            })
        );
        let friendList = [];
        friends.map((friend) => {
            const { _id, username, profilePicture } = friend;
            friendList.push({ _id, username, profilePicture });
        });
        res.status(200).json(friendList)
    } catch (err) {
        res.status(500).json(err)
    }
})

// Follow a user
router.put("/:id/follow", async (req, res) => {
    const { userId } = req.body;
    const { id } = req.params;
  
    if (userId === id) {
      return res.status(400).json({ message: "You can't follow yourself." });
    }
  
    try {
      const user = await User.findById(id);
      const currentUser = await User.findById(userId);
  
      if (!user || !currentUser) {
        return res.status(404).json({ message: "User not found." });
      }
  
      if (user.followers.includes(userId)) {
        return res.status(400).json({ message: "You already follow this user." });
      }
  
      // Update both users efficiently
      await Promise.all([
        User.findByIdAndUpdate(id, { $push: { followers: userId } }, { new: true }),
        User.findByIdAndUpdate(userId, { $push: { followings: id } }, { new: true })
      ]);
  
      return res.status(200).json({ message: "User has been followed." });
  
    } catch (error) {
      console.error("Follow error:", error);
      return res.status(500).json({ message: "Internal server error." });
    }
  });
  
  // Unfollow a user
  router.put("/:id/unfollow", async (req, res) => {
    const { userId } = req.body;
    const { id } = req.params;
  
    if (userId === id) {
      return res.status(400).json({ message: "You can't unfollow yourself." });
    }
  
    try {
      const user = await User.findById(id);
      const currentUser = await User.findById(userId);
  
      if (!user || !currentUser) {
        return res.status(404).json({ message: "User not found." });
      }
  
      if (!user.followers.includes(userId)) {
        return res.status(400).json({ message: "You are not following this user." });
      }
  
      // Update both users efficiently
      await Promise.all([
        User.findByIdAndUpdate(id, { $pull: { followers: userId } }, { new: true }),
        User.findByIdAndUpdate(userId, { $pull: { followings: id } }, { new: true })
      ]);
  
      return res.status(200).json({ message: "User has been unfollowed." });
  
    } catch (error) {
      console.error("Unfollow error:", error);
      return res.status(500).json({ message: "Internal server error." });
    }
  });

module.exports = router