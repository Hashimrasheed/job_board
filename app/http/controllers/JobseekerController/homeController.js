function homeController() {
    return {
        home(req, res) {
            res.render('home')
        },
        login(req, res) {
            res.render('user/login')
        }
    }
}
module.exports = homeController;