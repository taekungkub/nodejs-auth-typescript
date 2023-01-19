import { Router } from "express";
import { ERRORS } from "../helper/Errors";
import { errorResponse } from "../helper/utils";
const router = Router();

//------------ Welcome Route ------------//
router.get("/", (req, res) => {
  res.json(errorResponse(405, ERRORS.TYPE.NOT_ALLOWED, ERRORS.METHOD_NOT_ALLOW));
});

module.exports = router;
