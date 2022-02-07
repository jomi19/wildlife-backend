import express, { Request, Response } from "express";
import { authModule } from "./../modules";

const router = express.Router();
router.post("/", (req: Request, res: Response) => {
	authModule.logIn(req, res);
});

export { router as userRouter };
