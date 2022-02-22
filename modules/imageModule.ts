import { Request, Response } from "express";
import * as fs from "fs";
import multer from "multer";
import { Image, Error } from "./../models";
import { v4 as uuid, validate } from "uuid";

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		let path = "./images";
		if (process.env.NODE_ENV === "test") {
			path = "./images/test";
		}
		cb(null, path);
	},
	filename: function (req, file, cb) {
		const filename = new Date().getTime();

		cb(null, filename + file.originalname);
	},
});

const imageModule = {
	saveImagePath: async function (
		req: any,
		res: Response,
		path: string | undefined
	) {
		try {
			if (path === undefined)
				throw { title: "Error", message: "Kunde inte ladda upp bilden" };
			const { tags, description } = req.body;

			const image = Image.build({
				path,
				tags,
				description,
				_id: uuid(),
			});
			image.save();
			res.status(201).json(image);
		} catch (err: any) {
			if (path != undefined) fs.unlinkSync(`${path}`);
			const code = err.code || 500;
			const error: Error = {
				name: err.name,
				description: err.message,
			};
			console.log(err);
			return res.status(code).json({ error: error });
		}
	},

	uploadImage: multer({
		storage: storage,
		limits: {
			fileSize: 1024 * 1024 * 5,
		},
	}),

	getAllImages: async function (req: Request, res: Response) {
		//TODO fix errors
		try {
			const result = await Image.find().sort({ _id: 1 });
			return res.status(200).json(result);
		} catch (error: any) {
			const code = error.code || 500;
			error.code = null;
			return res.status(code).json({ error });
		}
	},

	getImage: async function (req: Request, res: Response) {
		try {
			const id = validateId(req.query.id);
			const result = await Image.findById(id);
			if (result === null)
				throw {
					name: "Culdent find that image",
					message: "Cant find any image with that id",
					errCode: 404,
				};
			return res.status(200).json(result);
		} catch (error: any) {
			const code = error.errCode || 500;
			return res.status(code).json({ error });
		}
	},

	deleteImage: async function (req: Request, res: Response) {
		try {
			const id = validateId(req.body.id);
			const image = await Image.findById(id);

			if (image === null)
				throw {
					name: "Cant find",
					message: "Culdent find the image to delete",
				};
			console.log(image.path);
			fs.unlinkSync(`./${image.path}`);

			image.delete();
			return res.status(204).json();
		} catch (error: any) {
			const code = error.errCode || 500;

			return res.status(code).json({ error });
		}
	},
	update: async function (req: Request, res: Response) {
		console.log("update");
		try {
			const { description } = req.body;
			let tags = req.body.tags?.split(",");
			const id = validateId(req.body.id);
			const image: any = await Image.findById(id);

			if (image === null) throw { name: "Cant find that image", errCode: 404 };
			if (tags) image.tags = tags;
			if (description) image.description = description;

			image.save();

			return res.status(200).json(image);
		} catch (error: any) {
			const code = error.errCode || 500;

			return res.status(code).json({ error });
		}
	},
};

function validateId(id: any) {
	if (!validate(id))
		throw {
			name: "Wrong id",
			message: "Not a valid uuid",
			errCode: 400,
		};
	return String(id);
}

export { imageModule };
