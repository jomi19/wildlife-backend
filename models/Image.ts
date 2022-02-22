import mongoose from "mongoose";

interface IImage {
	description?: string;
	path: string;
	created?: Date;
	tags?: Array<string>;
	_id?: string;
}

interface imageModelInterface extends mongoose.Model<ImageDoc> {
	build(attr: IImage): ImageDoc;
}
interface ImageDoc extends mongoose.Document {
	description?: string;
	path: string;
	created?: Date;
	tags?: Array<string>;
}
const ImageSchema = new mongoose.Schema({
	description: { type: String },
	path: { type: String, required: true },
	created: { type: Date, default: new Date() },
	tags: { type: Array, indexed: true, default: [] },
	_id: { type: String, indexed: true, required: true },
});

ImageSchema.statics.build = (attr: IImage) => {
	return new Image(attr);
};

const Image = mongoose.model<ImageDoc, imageModelInterface>(
	"Image",
	ImageSchema
);

export { Image, ImageSchema };
