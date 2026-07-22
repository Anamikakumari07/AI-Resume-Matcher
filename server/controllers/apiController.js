const getHome = (req, res) => {
    res.json({
        message: "Welcome to AI Resume Matcher Backend"
    });
};

module.exports = {
    getHome
};