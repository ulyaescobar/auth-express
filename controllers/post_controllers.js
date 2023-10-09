const { Post } = require("../models") 

let self = {}

self.index = async (req, res) => {
  try {
    const posts = await Post.findAll();
    return res.status(200).json({
      status: 200,
      message: "ok",
      data: posts
    })
  } catch (error) {
    console.error(error);
  }
}

self.update = async (req, res) => {
  try {
    const { body } = req.body
    const post_id = req.params.id
    const post = await Post.findByPk(post_id)
    if (!post) {
      return res.status(404).json({
        status: 404,
        message: `post with id ${post_id} not found`
      })
    }
    const user_id = req.user.id
    if (user_id !== post.user_id) {
      return res.status(403).json({
        status: 403,
        message: "you are not permitted"
      })
    }
    await post.update({body, user_id})
    return res.status(200).json({
      status: 200,
      message: "updated success",
      data: post
    })
  } catch (error) {
    console.error(error);
  }
}

self.create = async (req, res) => {
  try {
    const { body } = req.body;
    const user_id = req.user.id; // Mengambil ID pengguna yang terautentikasi

    const post = await Post.create({ body, user_id });
    return res.status(201).json({
      status: 201,
      message: "success created a post",
      data: post
    });
  } catch (error) {
    console.error(error);
  }
}

self.show = async (req, res) => {
  try {
    const post_id = req.params.id
    const post = await Post.findByPk(post_id)
    return res.status(200).json({
      status: 200,
      message: "ok",
      data: post
    })
  } catch (error) {
    console.error(error);
  }
}

self.my_index = async (req, res) => {
  try {
    const my_id = req.user.id
    const my_posts = await Post.findAll({
      where: {
        user_id: my_id
      }
    })
    return res.status(200).json({
      status: 200,
      message: "my posts",
      data: my_posts
    })
  } catch (error) {
    console.error(error);
  }
}

self.destroy = async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.id)
    if (!post) {
      return res.status(404).json({
        status: 404,
        message: `post with id ${req.params.id} not found`
      })
    }
    const user_id = req.user.id
    if (user_id !== post.user_id) {
      return res.status(403).json({
        status: 403,
        message: `you are not autorized`,
        data: []
      })
    }
    return res.status(200).json({
      status: 200,
      message: `post with id ${req.params.id} was deleted`,
      data: []
    })
  } catch (error) {
    console.error(error);
  }
}

module.exports = self;