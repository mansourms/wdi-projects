var express = require("express");
const session = require("express-session");

const path = require("path");

var bodyParser = require("body-parser");
const db = require("../models");

const app = express();
app.use(
  session({
    secret: "343ji43j4n3jn4jk3n"
  })
);
const port = 3000;

app.set("view engine", "ejs");
app.set("views", path.resolve(__dirname, "..", "views"));
app.use(express.static(path.resolve(__dirname, "..", "public")));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// app.post("/users", (req, res) => {
//     const { firstName, lastName, email } = req.body;
//     db.User.create({ firstName, lastName, email }).then(u =>
//         res.redirect(`/users/${u.id}`));
// });

// app.get("/users/:id/delete", (req, res) => {
//     const id = parseInt(req.params.id, 10);
//     db.User.findByPk(id)
//         .then(user => user.destroy({ force: true }))
//         .then(() => res.redirect("/users"));
// });

// app.get("/users/:id/edit", (req, res) => {
//     db.User.findByPk(parseInt(req.params.id, 10)).then(user =>
//         res.render("users/edit", { user })
//     );
// });

// app.post("/users/:id", (req, res) => {
//     const id = parseInt(req.params.id, 10);
//     const { firstName, lastName, email } = req.body;
//     db.User.update({ firstName, lastName, email }, { where: { id } }).then(() => {
//         res.redirect(`/users/${id}`);
//     });
// });

// app.get("/users", (req, res) => {
//     db.User.findAll().then(users => res.render("users/index", { users }));
// });
// app.get("/users/:id", (req, res) => {
//     db.User.findByPk(parseInt(req.params.id, 10)).then(user =>
//         res.render("users/show", { user })
//     );
// });
app.get("/", (req, res) => {
  res.redirect("/login");
});
app.get("/main", (req, res) => {
  // console.log(req.session.user);
  db.request.findAll({ where: { type: "p" } }).then(function(requestsP) {
    db.request.findAll({ where: { type: "r" } }).then(function(requestsR) {
    // res.send(requests);
    res.render("home/main", { requestsP,requestsR, user: req.session.user });
  });
});
});

app.get("/login", (req, res) => {
  res.render("login/login");
});
app.get("/sign_up", (req, res) => {
  res.render("login/sign_up");
});
app.post("/sign_up", function(req, res) {
  const { name, username, password, mobile } = req.body;
  db.User.create({
    login_name: name,
    full_name: username,
    password,
    mobile
  }).then(function(user) {
    console.log(user.login_name);
    res.redirect(`/login`);
  });
});
app.post("/login", function(req, res) {
  // res.send(req.body);
  const { password } = req.body;
  db.User.findAll({
    where: {
      login_name: req.body.username
    }
  }).then(function(user) {
    console.log(user)
    if (user[0].password === password) {
      req.session.user = user[0];
      res.redirect("/main");
    }
  });
});

app.post("/addRequest", function(req, res) {
  const { from, to, date, reqType, userId } = req.body;
  db.request
    .create({
      from,
      to,
      type: reqType,
      start: from,
      date,
      userId
    })
    .then(function(a) {
      // res.send(req.body);
      res.redirect("/main");
    });
});

// app.get("/login", (req, res) => {
//     res.send("GET request to /home");
// });
// app.get("/about", (req, res) => {
//     res.send("GET request to /about");
// });

app.listen(port, () => {
  console.log(`Server running. Visit http://localhost:${port}`);
});
