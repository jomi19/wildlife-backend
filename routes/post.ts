import express, { Request, Response } from "express";
import { Post, Error } from "./../models";
import { postModule } from "./../modules/";

const router = express.Router();

router.post("/", async (req: Request, res: Response) => {
	postModule.insert(req, res);
});

router.get("/", async (req: Request, res: Response) => {
	postModule.findOne(req, res);
});

router.put("/", async (req: Request, res: Response) => {
	postModule.update(req, res);
});

router.delete("/", async (req: Request, res: Response) => {
	postModule.delete(req, res);
});
router.get("/all", async (req: Request, res: Response) => {
	try {
		const result = await Post.find().sort({ _id: 1 });

		return res.status(200).json(result);
	} catch (err: any) {}
});

export { router as postRouter };
