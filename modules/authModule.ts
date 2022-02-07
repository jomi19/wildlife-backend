import { Request, Response } from "express";
import { User } from "./../models";
import * as jwt from "jsonwebtoken";

const authModule = {
	logIn: async function (req: Request, res: Response) {
		const { password, username } = req.body;
		console.log(username);
		try {
			const secret = process.env.JWT_SECRET || "testmode";
			const user = await User.findOne({ username: username });
			if (!user) throw { code: 401, name: "Could not find user" };
			if (user.password !== password)
				throw { code: 401, name: "Wrong password" };
			let token = jwt.sign({ username: username }, secret, { expiresIn: "7d" });

			return res.status(200).json({ username: username, token, time: "7d" });
		} catch (err: any) {
			const code = err.code || 500;

			err.code = undefined;
			return res.status(code).json({ error: err });
		}
	},
};

export { authModule };
