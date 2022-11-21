const fs = require("fs");

class Data{
  constructor(students,courses){
    this.students = students;
    this.courses = courses;
  }
}

dataCollection = null;

module.exports.initialize = function(){
  return new Promise((resolve,reject)=>{
    fs.readFile("./data/students.json", 'utf8', (err, students_data)=>{
      if(err){
        reject("Unable to read students.json file...!!!");
        return;
      }
      
      fs.readFile("./data/courses.json", 'utf8', (err, courses_data)=>{
        if(err){
          reject("Unable to read courses.json file...!!!");
          return;
        }
        
        dataCollection = new Data(JSON.parse(students_data), JSON.parse(courses_data));
        resolve();
      });
    });
  });
}

// To retrieve details of students
module.exports.getAllStudents = function(){
  return new Promise((resolve,reject)=>{
    if(dataCollection.students.length > 0){
        return resolve(dataCollection.students);
      }else{
        return reject("No results returned...!!!");
      }
  });
}

// To retrieve details of students with TA
module.exports.getTAs = function(){
  return new Promise((resolve,reject)=>{
    let TAs = [];

    for(let i = 0; i < dataCollection.students.length; i++){
      if(dataCollection.students[i].TA == true){
        TAs.push(dataCollection.students[i]);
      }
    }

    if(TAs.length > 0){
      resolve(TAs);
    }else{
      reject("No results returned...!!!")
    }
  });
}

// To retrieve details of courses
module.exports.getCourses = function(){
  return new Promise((resolve,reject)=>{
    if(dataCollection.courses.length > 0){
        return resolve(dataCollection.courses);
      }else{
        return reject("No results returned...!!!");
      }
  });
}

// To retrieve details of students which is enrolled in requested course
module.exports.getStudentsByCourse = function(course){
  return new Promise((resolve,reject)=>{
    let students_by_course = [];

    for(let i = 0; i < dataCollection.students.length; i++){
      if(dataCollection.students[i].course == course){
        students_by_course.push(dataCollection.students[i]);
      }
    }// end of loop

    if(students_by_course.length > 0){
      resolve(students_by_course);
    }else{
      reject("No students are enrolled in this course...!!!")
    }
  });
}

// to retrieve the details of a particular student
// module.exports.getStudentByNum = function(num){
//   return new Promise((resolve, reject) => {
//     // Validation
//     if (num < 0) { 
//       reject("Invalid student number"); 
//       return false; 
//     }
//     let student_details = null; 
//     for (let i = 1; i < dataCollection.students.length; i++) {
//       if(dataCollection.students[i]["studentNum"] == num){
//         student_details = dataCollection.students[i]; 
//         break;
//       }
//     }
    
//     if (dataCollection.students.length == 0){
//       reject("No student details found with Student Number:" + num);
//     }
//     resolve(student_details);
//   });
// }
module.exports.getStudentByNum=function(num){
  return new Promise(function(resolve,reject){
      var student = new Object();
      dataCollection.students.forEach((item) =>{
          if(item.studentNum==num){
              student=item;
          } 
          }
      ); 
      if(Object.entries(student).length === 0){
          reject("no results returned")
      }else{
          resolve(student);
      }
   
  });

}

module.exports.getCourseById=function(id){
  return new Promise(function(resolve,reject){
      
      var courseObj = new Object();
      dataCollection.courses.forEach((item) =>{
          if(item.courseId==id){
              courseObj=item;
           
           
          } 
          }
      ); 
      if(Object.entries(courseObj).length === 0){
          
          reject("query returned 0 results");
      }else{
          resolve(courseObj);
      }
   
  });

}

module.exports.addStudent=function(studentData){
  return new Promise(function(resolve,reject){
    var newNumber = dataCollection.students.length;
    newNumber = newNumber+1;
     
    let returnedTarget = Object.assign({studentNum: newNumber}, studentData);       
    if( dataCollection.students.push(returnedTarget)){
      resolve("Student details added successfully")
      return;
    }    
    else{
      reject("Something went wrong..!!!")
    }
  });
}

module.exports.updateStudent=function(studentData){
  

  return new Promise(function(resolve,reject){
    
      dataCollection.students.forEach((item) =>{
          if(item.studentNum==studentData.studentNum){
              dataCollection.students.splice(item.studentNum - 1, 1, studentData)
          } 
         }
      ); 
              resolve("It Worked");
  });

 
}
