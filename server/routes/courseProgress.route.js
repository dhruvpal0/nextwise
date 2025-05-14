import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { getCourseProgress, markAsComplete, markAsInComplete, updatedLectureProgress } from "../constrollers/courseProgress.controller.js";

const router = express.Router();

router.route("/:courseId").get(isAuthenticated,getCourseProgress);
router.route("/:courseId/lecture/:lectureId/view").post(isAuthenticated,updatedLectureProgress);
router.route("/:courseId/complete").post(isAuthenticated,markAsComplete);
router.route("/:courseId/incomplete").post(isAuthenticated,markAsInComplete);

export default router;
