import express, { Request, Response } from "express";
import { Post, Error } from "./../models";
import { imageModule } from "./../modules/";
import multer from "multer";
const router = express.Router();

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, "./images/");
	},
	filename: function (req, file, cb) {
		let filename = new Date().getTime();

		cb(null, filename + file.originalname);
	},
});
const upload = multer({
	storage: storage,
	limits: {
		fileSize: 1024 * 1024 * 5,
	},
});

router.get("/", async (req: Request, res: Response) => {
	imageModule.getImage(req, res);
});
router.post(
	"/",
	imageModule.uploadImage.single("image"),

	async (req: Request, res: Response) => {
		const filePath = req.file?.path;
		imageModule.saveImagePath(req, res, filePath);
	}
);

router.get("/all", async (req: Request, res: Response) => {
	imageModule.getAllImages(req, res);
});

router.delete("/", async (req: Request, res: Response) => {
	imageModule.deleteImage(req, res);
});

export { router as imageRouter };
