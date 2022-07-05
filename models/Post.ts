import mongoose from "mongoose";
import slugify from "slugify";
import { marked } from "marked";
import createDOMPurify from "dompurify";
import { JSDOM } from "jsdom";

const jsdom: any = new JSDOM("").window;
const domPurify = createDOMPurify(jsdom);
interface IPost {
	title: string;
	markdown: string;
	created?: Date;
	slug?: string;
	sanitizedHtml?: string;
	_id?: any;
}

interface postModelInterface extends mongoose.Model<PostDoc> {
	build(attr: IPost): PostDoc;
}
interface PostDoc extends mongoose.Document {
	title: string;
	markdown: string;
	created?: Date;
}
const postSchema = new mongoose.Schema({
	title: { type: String, required: true },
	markdown: { type: String, required: true },
	created: { type: Date, default: new Date() },
	slug: { type: String, required: true, unique: true, indexed: true },
	sanitizedHtml: { type: String, required: true },
});

postSchema.statics.build = (attr: IPost) => {
	return new Post(attr);
};

postSchema.pre("validate", function (next) {
	if (this.title && !this.slug) {
		const slug = slugify(this.title, { lower: true, strict: true });
		const date = new Date();
		const datePart = date.toISOString().split("T")[0];
		this.slug = `${slug}${datePart}`;
	}
	if (this.markdown) {
		const html = marked(this.markdown);
		this.sanitizedHtml = domPurify.sanitize(html);
	}
	next();
});

// postSchema.post("findOneAndUpdate", async function () {
// 	console.log(this.markdown);
// 	// const html = marked(this.markdown);
// 	// console.log(this.markdown);
// 	// this.sanitizedHtml = domPurify.sanitize(html);
// });
const Post = mongoose.model<PostDoc, postModelInterface>("Post", postSchema);

export { Post, postSchema };
