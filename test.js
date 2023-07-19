const { _id } = req.user;
const { password } = req.body;
validateMongoDbId(_id);
const user = await User.findById(_id);
if (password) {
    user.password = password;
    const updatedPassword = await user.save();
    res.json(updatedPassword);
} else {
    res.json(user);
}