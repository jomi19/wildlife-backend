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

const mh = new mongoose.Schema({
	curiosity: { type: Number, required: true, min: mhMin, max: mhMax },
	aggression: { type: Number, required: true, min: mhMin, max: mhMax },
	social: { type: Number, required: true, min: mhMin, max: mhMax },
	hunting: { type: Number, required: true, min: mhMin, max: mhMax },
	playfulness: { type: Number, required: true, min: mhMin, max: mhMax },
});

interface IDog {
	name: string;
	pictureUrl?: string;
	born: Date;
	hd?: string;
	mh?: Imh;
	prices?: string;
	_id?: any;
	sanitizedPrices?: string;
	sanitizedHd?: string;
}

interface dogModelInterface extends mongoose.Model<DogDoc> {
	build(attr: IDog): DogDoc;
}
interface DogDoc extends mongoose.Document {
	name: string;
	pictureUrl?: string;
	born: Date;
	hd?: string;
	mh?: Imh;
	prices?: string;
	_id?: any;
	sanitizedPrices?: string;
	sanitizedHd?: string;
}
const dogSchema = new mongoose.Schema({
	name: { type: String, required: true, unique: true },
	pictureUrl: { type: String },
	born: { type: Date, required: true },
	hd: { type: String },
	mh: { type: mh },
	prices: { type: String },
	sanitizedPrices: { type: String },
	sanitizedHd: { type: String },
});

dogSchema.statics.build = (attr: IDog) => {
	return new Dog(attr);
};

dogSchema.pre("validate", function (next) {
	if (this.prices) {
		const html = marked(this.prices);
		this.sanitizedPrices = domPurify.sanitize(html);
	}

	if (this.hd) {
		const html = marked(this.hd);
		this.sanitizedHd = domPurify.sanitize(html);
	}

	next();
});

const Dog = mongoose.model<DogDoc, dogModelInterface>("Dog", dogSchema);

export { Dog, dogSchema, Imh };
