import { Router } from "express";
import * as productController from "../controllers/productController";
import { ERRORS } from "../helper/Errors";
import { errorResponse, successResponse } from "../helper/utils";
import * as db from "../persistence/mysql/roles";
const router = Router();

//------------ Role Route ------------//
router.get("/", async (req, res) => {
  try {
    const result = await db.getRoles();
    if (!result) {
      return res.send(errorResponse(404, ERRORS.TYPE.RESOURCE_NOT_FOUND, "Roles not found"));
    }
    res.send(successResponse(result));
  } catch (error) {
    res.send(errorResponse(404, ERRORS.TYPE.RESOURCE_NOT_FOUND, error));
  }
});
router.post("/", async (req, res) => {
  try {
    const { role_title } = req.body;
    const result = await db.createRole(role_title);

    res.send(successResponse(result));
  } catch (error) {
    res.send(errorResponse(404, ERRORS.TYPE.RESOURCE_NOT_FOUND, error));
  }
});

export default router;
