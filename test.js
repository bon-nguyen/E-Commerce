
const rating = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const { star, prodId, comment } = req.body;
    try {
        const product = await Product.findById(prodId);
        let alreadyRated = product.ratings.find(
            (userId) => userId.postedby.toString() === _id.toString()
        );
        if (alreadyRated) {
            const updateRating = await Product.updateOne(
                {
                    ratings: { $elemMatch: alreadyRated },
                },
                {
                    $set: { "ratings.$.star": star, "ratings.$.comment": comment },
                },
                {
                    new: true,
                }
            );
        } else {
            const rateProduct = await Product.findByIdAndUpdate(
                prodId,
                {
                    $push: {
                        ratings: {
                            star: star,
                            comment: comment,
                            postedby: _id,
                        },
                    },
                },
                {
                    new: true,
                }
            );
        }
        const getallratings = await Product.findById(prodId);
        let totalRating = getallratings.ratings.length;
        let ratingsum = getallratings.ratings
            .map((item) => item.star)
            .reduce((prev, curr) => prev + curr, 0);
        let actualRating = Math.round(ratingsum / totalRating);
        let finalproduct = await Product.findByIdAndUpdate(
            prodId,
            {
                totalrating: actualRating,
            },
            { new: true }
        );
        res.json(finalproduct);
    } catch (error) {
        throw new Error(error);
    }
});

const rating = asyncHandle(async (req, res) => {
    const { id } = req?.user;
    const { star, prodId, comment } = req.body;

    try {
        validateMongoDbId(id);
        validateMongoDbId(prodId);
        if (!Number.isInteger(star) || star < 1 || star > 5) {
            throw new Error("Invalid 'star' value. It should be an integer between 1 and 5.");
        }
        if (typeof comment !== "string" || comment.trim() === "") {
            throw new Error("Invalid 'comment' value. It should be a non-empty string.");
        }

        // Update the rating if the user has already rated the product
        const updateResult = await Product.findOneAndUpdate(
            {
                _id: prodId,
                'ratings.postedBy': id,
            },
            {
                $set: {
                    'ratings.$.star': star,
                    'ratings.$.comment': comment,
                },
            },
            {
                new: true,
            }
        ).lean();

        if (!updateResult) {
            // Add a new rating if the user has not rated the product before
            const newRating = {
                star,
                comment,
                postedBy: id,
            };
            await Product.findByIdAndUpdate(prodId, {
                $push: { ratings: newRating },
            });
        }

        // Calculate the actual rating and update the product's totalRating
        const pipeline = [
            { $match: { _id: mongoose.Types.ObjectId(prodId) } },
            {
                $group: {
                    _id: null,
                    totalRating: { $sum: '$ratings.star' },
                    count: { $sum: 1 },
                },
            },
            {
                $project: {
                    _id: 0,
                    totalRating: { $divide: ['$totalRating', '$count'] },
                },
            },
        ];

        const [actualRating] = await Product.aggregate(pipeline);

        // Update the product with the calculated actualRating
        const finalProduct = await Product.findByIdAndUpdate(
            prodId,
            {
                totalRating: Math.round(actualRating.totalRating),
            },
            { new: true }
        );

        res.json(finalProduct);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'An error occurred while processing the rating.' });
    }
});
