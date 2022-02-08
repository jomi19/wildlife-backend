import express, { Request, Response } from "express";
import { Post } from "./../models";
import { postModule, authModule } from "./../modules/";

const checkToken = authModule.checkToken;
const router = express.Router();

router.post(
	"/",
	(req, res, next) => checkToken(req, res, next),
	(req: Request, res: Response) => postModule.insert(req, res)
);

router.get("/", async (req: Request, res: Response) => {
	postModule.findOne(req, res);
});

router.put(
	"/",
	(req, res, next) => checkToken(req, res, next),
	(req: Request, res: Response) => postModule.update(req, res)
);

router.delete(
	"/",
	(req, res, next) => checkToken(req, res, next),
	(req: Request, res: Response) => postModule.delete(req, res)
);
router.get("/all", async (req: Request, res: Response) => {
	try {
		const result = await Post.find().sort({ _id: 1 });

		return res.status(200).json(result);
	} catch (err: any) {}
});

export { router as postRouter };
