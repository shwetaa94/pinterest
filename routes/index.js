var express = require("express");
const passport = require("passport");
var router = express.Router();

const userModel = require("./users");
const postModel = require("./posts");
const upload = require("./multer");

const localStrategy = require("passport-local");
passport.use(new localStrategy(userModel.authenticate()));

/* GET home page. */

router.get("/", function (req, res, next) {
  res.render("index");
});
router.get("/login", function (req, res, next) {
  res.render("login", { error: req.flash("error") });
});

router.get("/profile", isLoggedIn, async function (req, res, next) {
  const user = await userModel.findOne({
      username: req.session.passport.user
    });
    user.populate("posts");

  console.log(user);

  res.render("profile", { user });
});

router.get("/feed", function (req, res, next) {
  res.render("feed");
});
// <input  name="file"/>
router.post(
  "/upload",
  isLoggedIn,
  upload.single("file"),
  async function (req, res, next) {
    if (!req.file) {
      res.status(404).send("No files are given");
    }
    const user = await userModel.findOne({
      username: req.session.passport.user
    });
    const post = await postModel.create({
      postText: req.body.filecaption,
      image: req.file.filename,
      user: user._id,
    });

    user.posts.push(post._id);
    await user.save();
    res.send("done");
  }
);

router.post("/register", function (req, res) {
  console.log(req.body); // Add this line to check form data
  var userdata = new userModel({
    username: req.body.username,
    fullname: req.body.fullname,
    email: req.body.email,
  });
  userModel
    .register(userdata, req.body.password)
    .then(function (registereduser) {
      passport.authenticate("local")(req, res, function () {
        res.redirect("/profile");
      });
    });
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/profile",
    failureRedirect: "/login",
    failureFlash: true,
  }),
  function (req, res) {}
);

router.get("/logout", function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/login");
  });
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

module.exports = router;
