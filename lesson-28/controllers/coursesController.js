// controllers/coursesController.js
"use strict";

const Course = require("../models/Course"), 
  User = require("../models/User"), 
  httpStatus = require("http-status-codes");

module.exports = {
  respondJSON: (req, res) => {
    res.json({
      status: httpStatus.OK,
      data: res.locals,
    });
  },

  errorJSON: (error, req, res, next) => {
    let errorObject;

    if (error) {
      errorObject = {
        status: httpStatus.INTERNAL_SERVER_ERROR,
        message: error.message,
      };
    } else {
      errorObject = {
        status: httpStatus.INTERNAL_SERVER_ERROR,
        message: "Unknown Error.",
      };
    }

    res.json(errorObject);
  },

  join: (req, res, next) => {
    let courseId = req.params.id,
      currentUser = req.user;

    if (currentUser) {
      User.findByIdAndUpdate(currentUser, {
        $addToSet: {
          courses: courseId,
        },
      })
        .then(() => {
          res.locals.success = true;
          next();
        })
        .catch((error) => {
          next(error);
        });
    } else {
      next(new Error("User must log in."));
    }
  },

  filterUserCourses: (req, res, next) => {
    let currentUser = req.user;

    if (currentUser) {
      let mappedCourses = res.locals.courses.map((course) => {
        let userJoined = currentUser.courses.some((userCourse) => {
          return userCourse.equals(course._id);
        });

        return Object.assign(course.toObject(), { joined: userJoined });
      });

      res.locals.courses = mappedCourses;
      next();
    } else {
      next();
    }
  },

  index: (req, res, next) => {
    Course.find()
      .then((courses) => {
        res.locals.courses = courses;
        next();
      })
      .catch((error) => {
        console.log(`Error fetching courses: ${error.message}`);
        next(error);
      });
  },
  indexView: (req, res) => {
    if (req.query.format === "json") {
      res.json(res.locals.users);
    } else {
      res.render("courses/index", {
        page: "courses",
        title: "All Courses",
      });
    }
  },

  new: (req, res) => {
    res.render("courses/new", {
      page: "new-course",
      title: "New Course",
    });
  },

  create: (req, res, next) => {
    let courseParams = {
      title: req.body.title,
      description: req.body.description,
      maxStudents: req.body.maxStudents,
      cost: req.body.cost,
    };

    Course.create(courseParams)
      .then((course) => {
        res.locals.redirect = "/courses";
        res.locals.course = course;
        next();
      })
      .catch((error) => {
        console.log(`Error saving course: ${error.message}`);
        next(error);
      });
  },

  redirectView: (req, res, next) => {
    let redirectPath = res.locals.redirect;
    if (redirectPath) res.redirect(redirectPath);
    else next();
  },

  show: (req, res, next) => {
    let courseId = req.params.id; 
    Course.findById(courseId) 
      .then((course) => {
        if (!course) {
          let error = new Error("Course not found");
          error.status = httpStatus.NOT_FOUND;
          throw error;
        }
        res.locals.course = course;
        next();
      })
      .catch((error) => {
        console.log(`Error fetching course by ID: ${error.message}`);
        next(error); 
      });
  },

  showView: (req, res) => {
    if (res.locals.course) {
      res.render("courses/show", {
        page: "course-details",
        title: "Course Details",
      });
    } else {
      res.render("error", {
        page: "error",
        title: "Error",
        message: "Course not found",
      });
    }
  },

  edit: (req, res, next) => {
    let courseId = req.params.id;
    Course.findById(courseId) 
      .then((course) => {
        res.render("courses/edit", {
          course: course,
          page: "edit-course",
          title: "Edit Course",
        });
      })
      .catch((error) => {
        console.log(`Error fetching course by ID: ${error.message}`);
        next(error);
      });
  },

  update: (req, res, next) => {
    let courseId = req.params.id,
      courseParams = {
        title: req.body.title,
        description: req.body.description,
        maxStudents: req.body.maxStudents,
        cost: req.body.cost,
      };

    Course.findByIdAndUpdate(courseId, {
      $set: courseParams,
    })
      .then((course) => {
        res.locals.redirect = `/courses/${courseId}`;
        res.locals.course = course;
        next();
      })
      .catch((error) => {
        console.log(`Error updating course by ID: ${error.message}`);
        next(error);
      });
  },

  delete: (req, res, next) => {
    let courseId = req.params.id;
    Course.findByIdAndRemove(courseId) 
      .then(() => {
        res.locals.redirect = "/courses";
        next();
      })
      .catch((error) => {
        console.log(`Error deleting course by ID: ${error.message}`);
        next(error);
      });
  },
};
