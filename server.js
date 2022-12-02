/*********************************************************************************
* WEB700 – Assignment 06
* I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part
* of this assignment has been copied manually or electronically from any other source
* (including 3rd party web sites) or distributed to other students.
*
* Name: Chahat Kaur Chhabra | Student ID: 118767219 | Date: 03 November 2022

* Online (Cyclic) Link: https://dark-red-marlin-sari.cyclic.app
*
********************************************************************************/

var HTTP_PORT = process.env.PORT || 8080;
var express = require("express");
var path = require("path");
const db = require("./modules/collegeData.js");

var app = express();
app.use(express.static("public"));
const exphbs = require("express-handlebars");
const res = require("express/lib/response");

app.use((req, res, next) => {

  let userAgent = req.get("user-agent");
  console.log(userAgent);
  next();
});

app.use(express.urlencoded({ extended: true }));

app.use(function (req, res, next) {
  let route = req.path.substring(1);
  app.locals.activeRoute = "/" + (isNaN(route.split('/')[1]) ? route.replace(/\/(?!.*)/, "") : route.replace(/\/(.*)/, ""));
  next();
});


app.engine('.hbs', exphbs.engine({
  extname: '.hbs',
  defaultLayout: "main",
  helpers: {
    navLink: function (url, options) {
      return '<li' +
        ((url == app.locals.activeRoute) ? ' class="nav-item active" ' : ' class="nav-item" ') +
        '><a class="nav-link" href="' + url + '">' + options.fn(this) + '</a></li>';
    },

    equal: function (lvalue, rvalue, options) {
      if (arguments.length < 3)
        throw new Error("Handlebars Helper equal needs 2 parameters");
      if (lvalue != rvalue) {
        return options.inverse(this);
      } else {
        return options.fn(this);
      }
    }
  }
}));

app.set('view engine', '.hbs');


app.get("/", (req, res) => {
  res.render('home');
});

app.get("/about", function (req, res) {
  res.render('about');
});

app.get("/htmlDemo", function (req, res) {
  res.render('htmlDemo');
});

app.get("/students", (req, res) => {
  if (req.query.course) {
    db.getStudentsByCourse(req.query.course).then(data => {
      res.render("students", { students: data });
      console.log(data);
    }).catch(err => {
      res.json({ message: "no results" });
    })
  } else {
    db.getAllStudents().then(data => {
      if (data.length > 0) {
        res.render("students", { students: data });
      } else {
        res.render("students", { message: "no results" });
      }
    }).catch(err => {
      res.send({ message: "no results" }); // show the error to the user
    });
  }
});

app.get("/courses", (req, res) => {
  db.getCourses().then(data => {
    if (data.length > 0) {
      res.render("courses", { courses: data });
    } else {
      res.render("courses", { message: "no results" });
    }
  }).catch(err => {
    res.render("courses", { message: "no results" }); // show the error to the user
  });
});

app.get("/courses/add", (req,res)=>{
  res.render("addCourse")
});

app.post("/courses/add", (req, res) => {
  db.addCourses(req.body).then(() => {
    res.redirect("/courses");
  }).catch((err) => {
    res.json("Error");
  });
});

app.get("/course/:id", (req, res) => {
  db.getCourseById(req.params.id).then((data) => {
    if (data) {
      res.render("course", { course: data });
    } else {
      res.status(404).send("Course Not Found");
    }
  }).catch(err => {
    res.json({ message: err });
  });
});


app.get("/student/delete/:studentNum", (req, res) => {
  db.deleteStudentByNum(req.params.studentNum).then(() => {
    res.redirect("/students");
  }).catch(err => {
    res.status(505).send("Unable to Remove Student ( Student not found )");
  });
});

app.get("/course/delete/:id", (req, res) => {
  db.deleteCourseById(req.params.id).then(() => {
    res.redirect("/courses");
  }).catch(err => {
    res.status(505).send("Unable to Remove Course ( Course not found )");
  });
});

app.get("/student/:studentNum", (req, res) => {
  
  let viewData = {};
  db.getStudentByNum(req.params.studentNum).then((data) => {
    if (data) {
      viewData.student = data;
    } else {
      viewData.student = null;
    }
  }).catch(() => {
    viewData.student = null;
  }).then(db.getCourses)
    .then((data) => {
      viewData.courses = data; 
      for (let i = 0; i < viewData.courses.length; i++) {
        if (viewData.courses[i].courseId == viewData.student.course) {
          viewData.courses[i].selected = true;
        }
      }
    }).catch(() => {
      viewData.courses = []; 
    }).then(() => {
      if (viewData.student == null) { 
        res.status(404).send("Student Not Found");
      } else {
        res.render("student", { viewData: viewData }); 
      }
    });
});

app.get("/students/add", (req, res) => {
  db.getCourses().then(data=>{
    courses = data;
    res.render("addStudent", {courses: data});
  }).catch(() => {
    res.render("addStudent", {courses: []});      
  });
});

app.post("/students/add", (req, res) => {
  req.body.TA = (req.body.TA) ? true : false;
  db.addStudent(req.body).then((data) => {
    /*res.render("students", { students: data });*/
    db.getAllStudents().then(data=>{
      if(data.length>0){
          res.render("students",{students: data});
      }else{
              res.render("students",{ message: "no results" });
      } 
    });
  }).catch((err) => {
    console.log(err);
    res.json("Error");
  });
});

app.post("/student/update", (req, res) => {
  req.body.TA = (req.body.TA) ? true : false;
  db.updateStudent(req.body).then(() => {
    res.redirect("/students");
  }).catch((err) => {
    res.json("Error");
  });
});

app.post("/course/update", (req, res) => {
  db.updateCourse(req.body);
  res.redirect("/courses");
});

app.use((req, res, next) => {
  res.status(404).sendFile(path.join(__dirname, "/views/404.html"));
});

db.initialize().then(() => {
  // start the server
  app.listen(HTTP_PORT, () => { console.log("server listening on port: " + HTTP_PORT) });
}).catch(err => {

  res.json({ message: err });
});