import { Request, Response } from "express";
import { Dog, Imh } from "../models";

const errorCantFind = {
	name: "Could not find the dog",
	message: "Could not find a dog with that name",
	statusCode: 404,
};

const dogModule = {
	insert: async function (req: Request, res: Response) {
		///TODO: fix status codes for error handeling
		try {
			const { name, pictureUrl, born, hd, mh, prices } = req.body;
			console.log("inserting");
			const dog = Dog.build({
				name: name.toLowerCase(),
				pictureUrl,
				born,
				hd,
				mh,
				prices,
			});

			await dog.save();

			return res.status(200).json(dog);
		} catch (err: any) {
			const code = 500;
			const error = { name: err.name, message: err.message };

			return res.status(code).json({ error: error });
		}
	},

	getSingle: async function (req: Request, res: Response) {
		try {
			const { name } = req.query;

			if (typeof name !== "string")
				throw { name: "Need dog name", message: "Name needs to be a string" };
			let dog = await Dog.findOne({ name: name.toLowerCase() });

			if (dog === null) throw errorCantFind;
			dog.name = firstUpper(dog.name);
			return res.status(200).json(dog);
		} catch (err: any) {
			const code = err.statusCode || 500;
			const error = { name: err.name, message: err.message };

			console.log(error);

			return res.status(code).json({ error: error });
		}
	},

	update: async function (req: Request, res: Response) {
		try {
			const { pictureUrl, born, hd, prices } = req.body;
			const name: String = req.body.name;
			const mh: Imh | undefined = req.body.mh;
			const dog = await Dog.findOne({ name: name.toLowerCase() });

			if (dog === null) throw errorCantFind;
			if (pictureUrl) dog.pictureUrl = pictureUrl;
			if (born) dog.born = born;
			if (hd) dog.hd = hd;
			if (mh) dog.mh = mh;
			if (prices) dog.prices = prices;

			await dog.save();
			return res.status(200).json(dog);
		} catch (err: any) {
			const code = err.statusCode || 500;
			const error = { name: err.name, message: err.message };

			return res.status(code).json({ error: error });
		}
	},

	getAll: async function (req: Request, res: Response) {
		try {
			const dogs = await Dog.find().sort({ name: 1 });

			dogs.forEach((dog) => {
				dog.name = firstUpper(dog.name);
			});
			return res.status(200).json(dogs);
		} catch (err) {}
	},

	delete: async function (req: Request, res: Response) {
		try {
			const name: string = req.body.name;
			const dog = await Dog.findOneAndDelete({ name: name });

			if (dog === null) throw errorCantFind;

			return res.status(204).json();
		} catch (err: any) {
			const code = err.statusCode || 500;
			const error = { name: err.name, message: err.message };

			return res.status(code).json({ error: error });
		}
	},
};

function firstUpper(string: string) {
	return `${string.charAt(0).toUpperCase()}${string.slice(1)}`;
}

export { dogModule };
