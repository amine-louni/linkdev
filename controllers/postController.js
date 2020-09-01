const Post = require('../models/Post');
const AppError = require('../utils/AppError');
const handlerFactory = require('../utils/handlerFactory');
const catchAsync = require('../utils/catchAsync');

exports.updateMyPost = catchAsync(async (req, res, next) => {
  const post = await Post.findById(req.params.id);
  if (!post) return next(new AppError('No document found with that ID', 404));

  if (!post.user.equals(req.currentUser._id)) {
    return next(
      new AppError(
        "You don't have the permission to perform the action with this item",
        403
      )
    );
  }

  post.text = req.body.text;
  const updatedPost = await post.save();

  res.status(201).json({
    status: 'success',
    doc: updatedPost,
  });
});

exports.deleteMyPost = catchAsync(async (req, res, next) => {
  const post = await Post.findById(req.params.id);

  if (!post) return next(new AppError('No document found with that ID', 404));

  if (!post.user.equals(req.currentUser._id)) {
    return next(
      new AppError(
        "You don't have the permission to perform the action with this item",
        403
      )
    );
  }

  await Post.findByIdAndRemove(req.params.id);

  res.status(204).json({
    status: 'success',
  });
});

exports.likesHandler = catchAsync(async (req, res, next) => {
  const post = await Post.findById(req.params.id);

  // check if the post is already liked by the user
  let filteredLikes;
  if (
    post.likes.filter((like) => like.user.equals(req.currentUser._id)).length >
    0
  ) {
    console.log('dislike');
    filteredLikes = post.likes.filter(
      (like) => !like.user.equals(req.currentUser._id)
    );
    post.likes = filteredLikes;
  } else {
    post.likes.unshift({ user: req.currentUser._id });
    console.log('like');
  }

  await post.save();
  res.status(200).json({
    status: 'success',
    likes: post.likes,
  });
});

exports.addComment = catchAsync(async (req, res, next) => {
  const post = await Post.findById(req.params.id);
  if (!post) return next(new AppError('No document found with that ID', 404));

  const newComment = {
    user: req.currentUser._id,
    text: req.body.text,
  };

  post.comments.unshift(newComment);

  await post.save();

  res.status(201).json({
    status: 'success',
    doc: post.comments,
  });
});

exports.deleteMyComment = catchAsync(async (req, res, next) => {
  const post = await Post.findById(req.params.post_id);
  // Check if the post exits
  if (!post) return next(new AppError('No document found with that ID', 404));
  // Check if the comment exits in the post
  const comment = post.comments.find(
    (comm) => comm.id === req.params.comment_id
  );
  if (!comment) {
    return next(new AppError("comment doesn't exists on the post"));
  }
  // Check the user
  if (!comment.user.equals(req.currentUser._id))
    return next(
      new AppError(
        "you don't have the permission to preform the action with this item",
        401
      )
    );

  // Remove the comment
  const removeIndex = post.comments
    .map((comm) => comm.user.toString())
    .indexOf(req.currentUser._id);
  post.comments.splice(removeIndex, 1);

  await post.save();

  res.status(204).json({
    status: 'success',
    docs: post.comments,
  });
});

exports.updateMyComment = catchAsync(async (req, res, next) => {
  const post = await Post.findById(req.params.post_id);
  // Check if the post exits
  if (!post) return next(new AppError('No document found with that ID', 404));
  // Check if the comment exits in the post
  const comment = post.comments.find(
    (comm) => comm.id === req.params.comment_id
  );
  if (!comment) {
    return next(new AppError("comment doesn't exists on the post"));
  }
  // Check the user
  if (!comment.user.equals(req.currentUser._id))
    return next(
      new AppError(
        "you don't have the permission to preform the action with this item",
        401
      )
    );

  // update the comment
  const updateIndex = post.comments
    .map((comm) => comm.user.toString())
    .indexOf(req.currentUser._id);
  post.comments[updateIndex].text = req.body.text;

  await post.save();

  res.status(201).json({
    status: 'success',
    docs: post.comments,
  });
});

exports.getAllPosts = handlerFactory.getAll(Post, {
  path: 'user',
  select: 'name avatar',
});
exports.getOnePost = handlerFactory.getOne(Post, {
  path: 'user',
  select: 'name avatar',
});
exports.createPost = handlerFactory.createOne(Post, true);
exports.updatePost = handlerFactory.updateOne(Post);
exports.deletePost = handlerFactory.deleteOne(Post);
