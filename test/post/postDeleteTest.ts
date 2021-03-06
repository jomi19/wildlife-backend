import app from "../../server";
import chai from "chai";
import chaiHttp from "chai-http";
import { assert } from "console";
import { sign } from "jsonwebtoken";

chai.use(chaiHttp);
const expect = chai.expect;
const secret = process.env.JWT_SECRET || "testmode";
const token = sign({ username: "test" }, secret, { expiresIn: "7d" });

const postTests = [
	{
		code: 404,
		description: "Testing to delete a post without a slug",
		errMsg: "Cannot find any posts with that id",
		errTitle: "Wrong id",
	},
	{
		code: 404,
		description: "Testing to delete a post with an slug that dont exists",
		slug: "donotexist",
		errTitle: "Wrong id",
		errMsg: "Cannot find any posts with that id",
	},
	{
		code: 204,
		slug: "test2",
		description: "Deleting a post succesfull ",
	},
];

describe("testing blog POST at /post", () => {
	postTests.forEach((test) => {
		it(test.description, (done) => {
			chai
				.request(app)
				.delete(`/post`)
				.set("content-type", "application/x-www-form-urlencoded")
				.set("x-access-token", token)
				.send({ slug: test.slug })
				.end((err: any, res: any) => {
					expect(res.statusCode).to.be.equal(test.code);
					expect(res.body).to.be.an("object");
					if (test.errMsg) {
						expect(res.body.error.description, test.errMsg);
						expect(res.body.error.name).to.equal(test.errTitle);
					}
					done();
				});
		});
	});
});
