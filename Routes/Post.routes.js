const express = require("express");
const { PostModel } = require("../Models/Post.model");

const postRouter = express.Router();

postRouter.get("/", async (req, res) => {
  const query = req.query;
  try {
    const posts = await PostModel.find(query);
    res.send(posts);
  } catch (error) {
    res.send({ msg: "Cannot able to find post", error: error.message });
  }
});

postRouter.post("/create", async (req, res) => {
  const payload = req.body;
  try {
    const post = new PostModel(payload);
    await post.save();
    res.send({ msg: "Post saved successfully" });
  } catch (error) {
    res.send({ msg: "Cannot save post", error: error.message });
  }
});

postRouter.delete("/delete/:id", async (req, res) => {
  const postID = req.params.id;
  const post = await PostModel.findOne({ _id: postID });
  const postID_in_note = post.userID;
  const postID_making_req = req.body.userID;
  try {
    if (postID_making_req != postID_in_note) {
      res.send({ msg: "You are not authorized to delete" });
    } else {
      await PostModel.findByIdAndDelete({ _id: postID });
      res.send({ msg: `Post with id: ${postID} has been deleted` });
    }
  } catch (error) {
    res.send({msg: "Note cannot be deleted", error: error.message})
  }
});

postRouter.patch("/update/:id", async (req, res) => {
    const payload = req.body;
    const postID = req.params.id;
    const post = await PostModel.findOne({ _id: postID });
    const postID_in_note = post.userID;
    const postID_making_req = req.body.userID;
    try {
      if (postID_making_req != postID_in_note) {
        res.send({ msg: "You are not authorized to update" });
      } else {
        await PostModel.findByIdAndUpdate({ _id: postID }, payload);
        res.send({ msg: `Post with id: ${postID} has been updated` });
      }
    } catch (error) {
      res.send({msg: "Note cannot be updated", error: error.message})
    }
  });

module.exports = {
  postRouter,
};
