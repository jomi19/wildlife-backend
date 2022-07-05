import express, { Request, Response } from "express";
import { dogModule, authModule } from "../modules/";

const checkToken = authModule.checkToken;
const router = express.Router();

router.post(
	"/",
	(req, res, next) => checkToken(req, res, next),
	(req: Request, res: Response) => dogModule.insert(req, res)
);

router.get("/", (req, res) => dogModule.getSingle(req, res));

router.put(
	"/",
	(req, res, next) => checkToken(req, res, next),
	(req: Request, res: Response) => dogModule.update(req, res)
);

router.get("/all", (req, res) => dogModule.getAll(req, res));

router.delete(
	"/",
	(req, res, next) => checkToken(req, res, next),
	(req, res) => dogModule.delete(req, res)
);
// });

export { router as dogRouter };
