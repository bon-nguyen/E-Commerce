const disliketheBlog = asyncHandler(async (req, res) => {
    const { blogId } = req.body;
    validateMongoDbId(blogId);

    const loginUserId = req?.user?._id;

    // Find the blog and projection to only retrieve the necessary fields
    const blog = await Blog.findById(blogId, { likes: 1, dislikes: 1 });

    // Check if the user has already liked or disliked the blog
    const isDisliked = blog.dislikes.includes(loginUserId);
    const isLiked = blog.likes.includes(loginUserId);

    // Define update operation and update flag
    let updateOperation;
    let updateFlag;

    if (isDisliked) {
        // If already disliked, remove dislike
        updateOperation = { $pull: { dislikes: loginUserId } };
        updateFlag = false;
    } else if (isLiked) {
        // If already liked, remove like
        updateOperation = { $pull: { likes: loginUserId } };
        updateFlag = false;
    } else {
        // If neither disliked nor liked, add dislike
        updateOperation = { $push: { dislikes: loginUserId } };
        updateFlag = true;
    }

    // Update the blog with the defined operation and set the isDisliked/isLiked flag
    const updatedBlog = await Blog.findByIdAndUpdate(
        blogId,
        {
            ...updateOperation,
            isDisliked: updateFlag,
            isLiked: false, // Ensure the like flag is reset
        },
        { new: true }
    );

    res.json(updatedBlog);
});
const liketheBlog = asyncHandler(async (req, res) => {
    const { blogId } = req.body;
    validateMongoDbId(blogId);
    // Find the blog which you want to be liked
    const blog = await Blog.findById(blogId);
    // find the login user
    const loginUserId = req?.user?._id;
    // find if the user has liked the blog
    const isLiked = blog?.isLiked;
    // find if the user has disliked the blog
    const alreadyDisliked = blog?.dislikes?.find(
        (userId) => userId?.toString() === loginUserId?.toString()
    );
    if (alreadyDisliked) {
        const blog = await Blog.findByIdAndUpdate(
            blogId,
            {
                $pull: { dislikes: loginUserId },
                isDisliked: false,
            },
            { new: true }
        );
        res.json(blog);
    }
    if (isLiked) {
        const blog = await Blog.findByIdAndUpdate(
            blogId,
            {
                $pull: { likes: loginUserId },
                isLiked: false,
            },
            { new: true }
        );
        res.json(blog);
    } else {
        const blog = await Blog.findByIdAndUpdate(
            blogId,
            {
                $push: { likes: loginUserId },
                isLiked: true,
            },
            { new: true }
        );
        res.json(blog);
    }
});
const disliketheBlog = asyncHandler(async (req, res) => {
    const { blogId } = req.body;
    validateMongoDbId(blogId);
    // Find the blog which you want to be liked
    const blog = await Blog.findById(blogId);
    // find the login user
    const loginUserId = req?.user?._id;
    // find if the user has liked the blog
    const isDisLiked = blog?.isDisliked;
    // find if the user has disliked the blog
    const alreadyLiked = blog?.likes?.find(
        (userId) => userId?.toString() === loginUserId?.toString()
    );
    if (alreadyLiked) {
        const blog = await Blog.findByIdAndUpdate(
            blogId,
            {
                $pull: { likes: loginUserId },
                isLiked: false,
            },
            { new: true }
        );
        res.json(blog);
    }
    if (isDisLiked) {
        const blog = await Blog.findByIdAndUpdate(
            blogId,
            {
                $pull: { dislikes: loginUserId },
                isDisliked: false,
            },
            { new: true }
        );
        res.json(blog);
    } else {
        const blog = await Blog.findByIdAndUpdate(
            blogId,
            {
                $push: { dislikes: loginUserId },
                isDisliked: true,
            },
            { new: true }
        );
        res.json(blog);
    }
});