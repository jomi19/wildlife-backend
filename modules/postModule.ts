import express, { Request, Response } from "express";
import { Post, Error } from "./../models";

const postModule = {
	insert: async function (req: Request, res: Response) {
		///TODO: Fix correct error codes
		try {
			const { markdown, title } = req.body;
			const post = Post.build({
				title,
				markdown,
				created: new Date(),
			});
			await post.save();

			return res.status(200).json(post);
		} catch (err: any) {
			const code = 500;
			const error: Error = {
				name: err.name,
				description: err.message,
			};

			return res.status(code).json({ error: error });
		}
	},

	update: async function (req: Request, res: Response) {
		try {
			const filter = { slug: req.body.slug };
			const post: any = await Post.findOne(filter);

			if (post === null)
				throw {
					name: "Cannot find",
					message: "Cant find an post with that slug or slug missing",
					code: 404,
				};
			if (req.body.markdown && post.markdown.length > 0)
				post.markdown = req.body.markdown;
			if (req.body.title && post.title.length > 0) post.title = req.body.title;
			post?.save();

			return res.status(200).json(post);
		} catch (err: any) {
			const code = err.code || 500;
			const error: Error = {
				name: err.name,
				description: err.message,
			};
			return res.status(code).json({ error: error });
		}
	},

	delete: async function (req: Request, res: Response) {
		try {
			let test = await Post.findOneAndDelete({ slug: req.body.slug });
			if (test === null)
				throw {
					name: "Wrong id",
					message: "Cannot find any posts with that slug",
					code: 404,
				};
			return res.status(204).json();
		} catch (err: any) {
			const code = err.code || 500;
			const error: Error = {
				name: err.name,
				description: err.message,
			};
			return res.status(code).json({ error });
		}
	},

	findOne: async function (req: Request, res: Response) {
		try {
			const post = await Post.find({ slug: req.query.slug });

			if (post.length < 1)
				throw {
					name: "Wrong slug",
					message: "Cannot find any posts with that slug",
					code: 404,
				};
			return res.status(200).json(post[0]);
		} catch (err: any) {
			const code = err.code || 500;
			const error: Error = {
				name: err.name,
				description: err.message,
			};
			return res.status(code).json({ error });
		}
	},
};

export { postModule };
