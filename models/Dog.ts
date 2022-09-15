import mongoose from "mongoose";
import { marked } from "marked";
import createDOMPurify from "dompurify";
import { JSDOM } from "jsdom";

const jsdom: any = new JSDOM("").window;
const domPurify = createDOMPurify(jsdom);
const mhMin = 0;
const mhMax = 5;

interface Imh extends mongoose.Document {
	curiosity: Number;
	aggression: Number;
	social: Number;
	hunting: Number;
	playfulness: Number;
}

interface IInfoBlock extends mongoose.Document {
	title: String;
	markdown: String;
	sanitizedHtml: String;
}

const mh = new mongoose.Schema({
	curiosity: { type: Number, required: true, min: mhMin, max: mhMax },
	aggression: { type: Number, required: true, min: mhMin, max: mhMax },
	social: { type: Number, required: true, min: mhMin, max: mhMax },
	hunting: { type: Number, required: true, min: mhMin, max: mhMax },
	playfulness: { type: Number, required: true, min: mhMin, max: mhMax },
});

const infoBlock = new mongoose.Schema({
	title: { type: String, required: true },
	markdown: { type: String },
	sanitizedHtml: { type: String },
});

interface IDog {
	name: string;
	pictureUrl?: string;
	born: Date;
	mh?: Imh;
	_id?: any;
	infoBlock: Array<IInfoBlock>;
	fullName: string;
}

interface dogModelInterface extends mongoose.Model<DogDoc> {
	build(attr: IDog): DogDoc;
}

interface DogDoc extends mongoose.Document {
	name: string;
	pictureUrl?: string;
	born: Date;
	mh?: Imh;
	_id?: any;
	infoBlock: Array<IInfoBlock>;
	fullName: string;
}
const dogSchema = new mongoose.Schema({
	name: { type: String, required: true, unique: true },
	pictureUrl: { type: String },
	born: { type: Date, required: true },
	mh: { type: mh },
	infoBlock: { type: Array },
	fullName: { type: String },
});

dogSchema.statics.build = (attr: IDog) => {
	return new Dog(attr);
};

dogSchema.pre("validate", function (next) {
	if (this.infoBlock) {
		this.infoBlock.forEach((block) => {
			if (block.markdown) {
				const html = marked(block.markdown);
				block.sanitizedHtml = domPurify.sanitize(html);
			}
		});
	}
	next();
});

const Dog = mongoose.model<DogDoc, dogModelInterface>("Dog", dogSchema);

export { Dog, dogSchema, Imh };
