const Sequelize = require('sequelize');
var sequelize = new Sequelize('tudgynhc', 'tudgynhc', 'iyzR90FS2VPc3uOUHPl7fWoUwMDP1CmP', {
  host: 'peanut.db.elephantsql.com',
  dialect: 'postgres',
  port: 5432,
  dialectOptions: {
    ssl: { rejectUnauthorized: false }
  },
  query: { raw: true }
});

var Student = sequelize.define('Student', {
  studentNum: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  firstName: Sequelize.STRING,
  lastName: Sequelize.STRING,
  email: Sequelize.STRING,
  addressStreet: Sequelize.STRING,
  addressCity: Sequelize.STRING,
  addressProvince: Sequelize.STRING,
  TA: Sequelize.BOOLEAN,
  status: Sequelize.STRING
}, {
  createdAt: false,
  updatedAt: false
});

var Course = sequelize.define('Course', {
  courseId: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  courseCode: Sequelize.STRING,
  courseDescription: Sequelize.STRING

}, {
  createdAt: false,
  updatedAt: false
});

Course.hasMany(Student, { foreignKey: 'course' });

module.exports.initialize = function () {
  return new Promise(function (resolve, reject) {
    sequelize.sync().then(() => {
      resolve('\nThe connection was successful \n');
    }).catch(err => {
      reject('unable to sync the database');
    })
  });
}

// To retrieve details of students
module.exports.getAllStudents = function () {
  return new Promise(function (resolve, reject) {
    Student.findAll({
      attributes: ['studentNum', 'firstName', 'lastName', 'email', 'addressStreet', 'addressCity', 'addressProvince', 'TA', 'status', 'course']
    }).then((students) => {
      resolve(students);
    }).catch(err => {

      reject("No results returned");

    })

  });
}


// Retrieve details of courses
module.exports.getCourses = function () {
  return new Promise(function (resolve, reject) {
    Course.findAll({
      attributes: ['courseId', 'courseCode', 'courseDescription']
    }).then(courses => {
      resolve(courses);
    }).catch(err => {
      reject(err);
    })
  });
}

// Retrieve details of students who are enrolled in requested course

module.exports.getStudentsByCourse = function (course) {
  return new Promise((resolve, reject) => {
    Student.findAll({
      attributes: ['studentNum', 'firstName', 'lastName', 'email', 'addressStreet', 'addressCity', 'addressProvince', 'TA', 'status', 'course'],
      where: {
        course: course
      }
    }).then(students => {
      resolve(students);
    }).catch(err => {
      reject("no results returned");
    })
  });
}

// Retrieve details of a particular student

module.exports.getStudentByNum=function(num){
  return new Promise((resolve,reject)=>{
      Student.findAll({
          attributes: ['studentNum','firstName','lastName','email','addressStreet','addressCity','addressProvince','TA','status','course'],
          where: { 
              studentNum: num
          }
      }).then(students=>{
          resolve(students[0]);
      }).catch(err=>{
          reject("no results returned");
      })
  })
}

module.exports.addStudent = function (studentData) {
  return new Promise(function (resolve, reject) {
    studentData.TA = (studentData.TA) ? true : false;
    for (attribute in studentData) {
      if (studentData[attribute] === "") {
        studentData[attribute] = null;
      }
    }
    Student.create(studentData).then((newStudent) => {
      resolve(newStudent);
    }).catch(err => {
      reject("unable to create student");
    });
  });
}

module.exports.getCourseById = function (id) {
  return new Promise(function (resolve, reject) {
    Course.findAll({
      attributes: ['courseId', 'courseCode', 'courseDescription'],
      where: {
        courseId: id
      }
    }).then(course => {
      resolve(course[0]);
    }).catch(err => {
      reject("no results returned");
    })
  });
}

module.exports.updateStudent = function (studentData) {
  return new Promise(function (resolve, reject) {
    studentData.TA = (studentData.TA) ? true : false;
    for (attribute in studentData) {
      if (studentData[attribute] === "") {
        studentData[attribute] = null;
      }
    }
    Student.update(studentData, {
      where: {
        studentNum: studentData.studentNum
      }
    }).then(() => {
      resolve("Student whith id: " + studentData.studentNum + " has been updated")
    }).catch(err => {
      reject("unable to update student")
    })
  });
}

module.exports.addCourses = function (courseData) {
  return new Promise(function (resolve, reject) {
    for (attribute in courseData) {
      if (courseData[attribute] === "") {
        courseData[attribute] = null;
      }
    }
    Course.create(courseData).then((newCourse) => {
      resolve(newCourse);
    }).catch(err => {
      reject("unable to create course");
    });
  });
}

module.exports.updateCourse = function (courseData) {
  return new Promise(function (resolve, reject) {
    for (attribute in courseData) {
      if (courseData[attribute] === "") {
        courseData[attribute] = null;
      }
    }
    Course.update(courseData, {
      where: {
        courseId: courseData.courseId
      }
    }).then(() => {
      resolve("Course whith id: " + courseData.courseId + " has been updated")
    }).catch(err => {
      reject("unable to update course")
    })
  });
}

module.exports.deleteCourseById = function (id) {
  return new Promise(function (resolve, reject) {
    Course.destroy({
      where: {
        courseId: id
      }
    }).then(() => {
      resolve("Course whith id: " + id + " has been updated")
    }).catch(err => {
      reject("destroy method encountered an error")
    })
  });
}

module.exports.deleteStudentByNum = function (num) {
  return new Promise(function (resolve, reject) {
    Student.destroy({
      where: {
        studentNum: num
      }
    }).then(() => {
      resolve("Course whith id: " + num + " has been updated")
    }).catch(err => {
      reject("destroy method encountered an error")
    })
  });
}