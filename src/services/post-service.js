const prisma = require("../models/prisma");

const postService = {};
postService.createPost = (data) => prisma.post.create({ data });

module.exports = postService;
