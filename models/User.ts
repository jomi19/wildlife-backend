import mongoose from "mongoose";

interface IUser {
	id?: string;
	password: string;
	username?: string;
}

interface UserModelInterface extends mongoose.Model<UserDoc> {
	build(attr: IUser): UserDoc;
}
interface UserDoc extends mongoose.Document {
	id?: string;
	password: string;
	username?: string;
}
const UserSchema = new mongoose.Schema({
	username: { type: String },
	password: { type: String, required: true },
});

const User = mongoose.model<UserDoc, UserModelInterface>("User", UserSchema);

export { User, UserSchema };
