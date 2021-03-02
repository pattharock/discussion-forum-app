// APP INIT AND CONSTANTS

const port = 8000;
const host = "localhost";
const { v4: uuidv4 } = require("uuid");
const express = require("express");
const app = express();
const session = require("express-session");

app.set("view engine", "pug");
app.set("views", "views");

app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));

app.use(
  session({
    secret: "Hello World",
  })
);

const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/kohraDB", (err) => {
  if (err) {
    console.log("MongoDB Connection Error: " + err);
  } else {
    console.log("Connected to MongoDB");
  }
});

let userSchema = new mongoose.Schema(
  {
    _id: String,
    name: String,
    email: String,
    password: String,
  },
  { _id: false }
);
let userRecord = mongoose.model("userRecord", userSchema, "userRecord");

let questionSchema = new mongoose.Schema(
  {
    _id: String,
    space: String,
    title: String,
    content: String,
    answer: [{ type: mongoose.Schema.Types.String, ref: "answerRecord" }],
    up: [String],
    time: Date,
    creatorid: { type: mongoose.Schema.Types.String, ref: "userRecord" },
    creatorName: String,
  },
  { _id: false }
);
let questionRecord = mongoose.model(
  "questionRecord",
  questionSchema,
  "questionRecord"
);

let answerSchema = new mongoose.Schema(
  {
    _id: String,
    qid: { type: mongoose.Schema.Types.String, ref: "questionRecord" },
    content: String,
    uid: { type: mongoose.Schema.Types.String, ref: "userRecord" },
    uname: String,
    time: Date,
  },
  { _id: false }
);
let answerRecord = mongoose.model("answerRecord", answerSchema, "answerRecord");

app.get("/", (req, res) => {
  questionRecord
    .find()
    .populate({ path: "answer", options: { sort: { time: 1 } } })
    .sort([["time", -1]])
    .exec((err, result) => {
      if (err) {
        console.log("Database error: " + err);
        res.sendStatus(500);
      } else {
        if (req.session.loggedin) {
          res.render("home", { questions: result, user: req.session });
        } else {
          res.render("home", { questions: result, user: undefined });
        }
      }
    });
});

app.get("/login", (req, res) => {
  if (req.query.action && req.query.action === "logout") {
    req.session.destroy((err) => {
      if (err) {
        console.log(err);
      }
    });
    res.redirect("/");
  } else {
    res.render("login");
  }
});

app.post("/login", (req, res) => {
  var email = req.body.userEmail;
  var password = req.body.userPassword;

  if (email && password) {
    userRecord.countDocuments({ email: email }).exec((err, count) => {
      if (err) {
        console.log(err);
      } else {
        if (count <= 0) {
          res.render("login", { msg: "User is not Registered" });
        } else {
          userRecord
            .find({ email: email, password: password })
            .exec((err, result) => {
              if (err) {
                console.log("Database Error: " + err);
              } else {
                if (result.length > 0) {
                  req.session.name = result[0].name;
                  req.session.email = result[0].email;
                  req.session.uid = result[0]._id;
                  req.session.loggedin = true;
                  req.session.save((err) => {
                    if (err) {
                      console.log("Error in saving session: " + err);
                    } else {
                      res.redirect("/");
                    }
                  });
                } else {
                  res.render("login", { msg: "Incorrect Password, try again" });
                }
              }
            });
        }
      }
    });
  } else {
    res.render("login", { msg: "Please enter all the details." });
  }
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.post("/register", (req, res) => {
  var name = req.body.userName;
  var email = req.body.userEmail;
  var password1 = req.body.userPassword1;
  var password2 = req.body.userPassword2;
  if (name && email && password1 && password2) {
    userRecord
      .find({
        email: email,
      })
      .exec((err, result) => {
        if (err) {
          console.log("Error in finding user in database: " + err);
        } else {
          if (result.length > 0) {
            res.render("register", {
              msg: "Email ID already linked to Registered Account, ",
              login: true,
            });
          } else {
            if (password1 !== password2) {
              res.render("register", {
                msg: "Passwords to Not Match, Try again",
              });
            } else {
              let unique = uuidv4();
              var user = new userRecord({
                _id: unique,
                name: name,
                email: email,
                password: password1,
              });
              user.save((err, result) => {
                if (err) {
                  console.log("Database Error " + err);
                } else {
                  req.session.name = result.name;
                  req.session.email = result.email;
                  req.session.uid = result._id;
                  req.session.loggedin = true;
                  req.session.save((error) => {
                    if (error) {
                      console.log(error);
                    } else {
                      res.redirect("/");
                    }
                  });
                }
              });
            }
          }
        }
      });
  } else {
    res.render("register", {
      msg: "Please complete the Registration Form",
      login: false,
    });
  }
});

app.get("/detail/qid:quesid", (req, res) => {
  questionRecord
    .findOne({ _id: req.params.quesid })
    .populate({ path: "answer", options: { sort: "time" } })
    .exec((err, result) => {
      if (err) {
        console.log(err);
      } else {
        if (req.session.loggedin) {
          res.render("questionDetail", { result: result, user: req.session });
        } else {
          res.render("questionDetail", { result: result });
        }
      }
    });
});

app.post("/detailques/qid:quesid", (request, response) => {
  let qid = request.params.quesid;
  let uid = request.session.uid;
  let content = request.body.userAnswer;
  if (content) {
    let random = uuidv4();
    let answer = new answerRecord({
      _id: random,
      qid: qid,
      content: content,
      uid: uid,
      uname: request.session.name,
      time: new Date(),
    });
    answerRecord.create(answer, (error, result) => {
      if (error) {
        console.log(error);
      } else {
        questionRecord.find({ _id: result.qid }).exec((error, questions) => {
          if (error) {
            console.log(error);
          } else {
            let answersArr = questions[0].answer;
            answersArr.push(result._id);
            questionRecord.update(
              { _id: result.qid },
              { answer: answersArr },
              (errors, updates) => {
                if (errors) {
                  console.log(errors);
                } else {
                  console.log(updates);
                }
              }
            );
          }
        });
        response.redirect(request.get("referer"));
      }
    });
  } else {
    response.redirect(request.get("referer"));
  }
});

app.get("/question-form", (req, res) => {
  if (req.session.loggedin) {
    res.render("newQuestion", { user: req.session });
  } else {
    res.render("newQuestion");
  }
});

app.post("/question-form", (req, response) => {
  var qtitle = req.body.quesTitle;
  var qspace = req.body.quesSpace;
  var qcontent = req.body.quesContent;

  if (qtitle && qspace && qcontent) {
    let random = uuidv4();
    var question = new questionRecord({
      _id: random,
      space: qspace,
      title: qtitle,
      content: qcontent,
      answer: [],
      up: [],
      time: new Date(),
      creatorid: req.session.uid,
      creatorName: req.session.name,
    });
    questionRecord.create(question, (error, result) => {
      if (error) {
        console.log(error);
      } else {
        response.redirect("/");
      }
    });
  } else {
    response.render("newQuestion", {
      user: req.session,
      msg: "Please complete the form to submit.",
    });
  }
});

app.get("/upvote/qid:quesid", (request, response) => {
  if (request.session.loggedin) {
    let qid = request.params.quesid;
    let uid = request.session.uid;
    questionRecord.find({ _id: qid }).exec((err, res) => {
      if (err) {
        console.log(err);
      } else {
        let upvotes = res[0].up;
        let found = false;
        for (let i = 0; i < upvotes.length; i++) {
          if (upvotes[i] === uid) {
            found = true;
          }
        }
        if (found) {
          let index = upvotes.indexOf(uid);
          upvotes.splice(index, 1);
        } else {
          upvotes.push(uid);
        }
        res[0].up = upvotes;
        questionRecord.update(
          { _id: qid },
          { up: upvotes },
          (error, responses) => {
            if (error) {
              console.log(error);
            } else {
              response.redirect(request.get("referer"));
            }
          }
        );
        console.log(upvotes);
      }
    });
  } else {
    console.log("No log in");
    response.redirect(request.get("referer"));
  }
});

//GET /deleteques:quesid
app.get("/deleteques:quesid", (request, response) => {
  if (request.session.loggedin) {
    let questodelete = request.params.quesid;
    questionRecord.find({ _id: questodelete }).exec((err, result) => {
      if (err) {
        console.log(err);
      } else {
        if (result.length > 0) {
          let anstodelete = result[0].answer;
          answerRecord
            .deleteMany({ _id: { $in: anstodelete } })
            .exec((err, res) => {
              if (err) {
                console.log(err);
              } else {
                questionRecord.deleteOne(
                  { _id: questodelete },
                  (errors, results) => {
                    if (errors) {
                      console.log(errors);
                    } else {
                      response.redirect("/");
                    }
                  }
                );
              }
            });
        } else {
          response.send("QUESTION NOT FOUND");
        }
      }
    });
  } else {
    response.send("NOT AUTHORISED");
  }
});

app.get("/deleteans:ansid/ques:quesid", (request, response) => {
  let ansid = request.params.ansid;
  let quesid = request.params.quesid;

  answerRecord.deleteOne({ _id: ansid }).exec((err, result) => {
    if (err) {
      console.log(err);
    } else {
      questionRecord.find({ _id: quesid }).exec((error, res) => {
        if (error) {
          console.log(error);
        } else {
          let ansarr = res[0].answer;
          let ctr = [];
          let index = ansarr.indexOf(ansid);
          if (index > -1) {
            ansarr.splice(index, 1);
          }
          questionRecord.update(
            { _id: quesid },
            { answer: ansarr },
            (error, done) => {
              if (error) {
                console.log(error);
              } else {
                response.redirect(request.get("referer"));
              }
            }
          );
        }
      });
    }
  });
});

app.post("/updateques:quesid", (request, response) => {
  let qid = request.params.quesid;
  let title = request.body.quesTitle;
  let space = request.body.quesSpace;
  let content = request.body.quesContent;

  if (title && space && content) {
    questionRecord
      .findOneAndUpdate(
        { _id: qid },
        {
          space: space,
          title: title,
          content: content,
        }
      )
      .exec((err, result) => {
        if (err) {
          console.log(err);
        } else {
          response.redirect(request.get("referer"));
        }
      });
  } else {
    response.redirect(request.get("referer"));
  }
});

app.get("/sortbyspace/:space", (request, response) => {
  let qspace = request.params.space;
  questionRecord
    .find({ space: qspace })
    .populate({ path: "answer", options: { sort: { time: 1 } } })
    .sort([["time", -1]])
    .exec((err, result) => {
      if (err) {
        console.log("Database error: " + err);
        response.sendStatus(500);
      } else {
        if (request.session.loggedin) {
          response.render("home", { questions: result, user: request.session });
        } else {
          response.render("home", { questions: result, user: undefined });
        }
      }
    });
});

app.listen(port, host, () => {
  console.log("Server started at PORT: " + port);
});
