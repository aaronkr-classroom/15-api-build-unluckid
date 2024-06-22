
// routes/index.js
"use strict";

const Subscriber = require("../models/Subscriber");

/*
 * Listing 26.2 (p. 381)
 * @TODO: index.js에 모든 라우트 임포팅
 */

const router = require("express").Router(),
  homeRoutes = require("./homeRoutes"),
  subscribersRoutes = require("./subscriberRoutes"),
  userRoutes = require("./userRoutes"),
  courseRoutes = require("./courseRoutes"),
  talkRoutes = require("./talkRoutes"),
  trainRoutes = require("./trainRoutes"),
  errorRoutes = require("./errorRoutes");

// 네임스페이스가 적용된 관련 라우트 모듈로부터의 라우트 사용
router.use("/users", userRoutes);
router.use("/subscribers", subscribersRoutes);
router.use("/courses", courseRoutes);
router.use("/trains", trainRoutes);
router.use("/talks", talkRoutes);

router.use("/", homeRoutes);
router.use("/", errorRoutes);

// index.js로부터 라우트 익스포트
module.exports = router;
