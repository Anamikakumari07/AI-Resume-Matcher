const getHome = (req, res) => {
    res.json({
        success: true,
        message: "Backend Working"
    });
};

module.exports = {
    getHome
};