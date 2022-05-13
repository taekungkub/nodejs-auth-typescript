import { Router } from "express";
const router = Router();

//------------ Welcome Route ------------//
router.get("/", (req, res) => {
  res.send("Express + TypeScript Server ");
});

module.exports = router;
