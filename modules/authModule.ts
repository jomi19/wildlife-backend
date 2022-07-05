import { Request, Response } from "express";
import { User } from "./../models";
import * as jwt from "jsonwebtoken";

const secret = process.env.JWT_SECRET || "testmode";
const tokenDuration = "7d";

const authModule = {
	logIn: async function (req: Request, res: Response) {
		const { password, username } = req.body;

		try {
			const user = await User.findOne({ username: username });
			if (!user) throw { code: 401, name: "Could not find user" };
			if (user.password !== password)
				throw { code: 401, name: "Wrong password" };
			let token = jwt.sign({ username: username }, secret, {
				expiresIn: tokenDuration,
			});

			return res
				.status(200)
				.json({ username: username, token, time: tokenDuration });
		} catch (err: any) {
			const code = err.code || 500;

			err.code = undefined;
			return res.status(code).json({ error: err });
		}
	},

	checkToken: async function (req: Request, res: Response, next: Function) {
		const token = req.headers["x-access-token"];
		console.log(token);
		if (typeof token !== "string") {
			return res.status(401).json({ error: { name: "Invalid token" } });
		}

		jwt.verify(token, secret, (err) => {
			if (err)
				return res.status(401).json({ error: { name: "Invalid token" } });
			next();
		});
	},
};

export { authModule };
