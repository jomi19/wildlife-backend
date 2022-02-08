import app from "../../server";
import chai from "chai";
import chaiHttp from "chai-http";
import { assert } from "console";
import { sign } from "jsonwebtoken";

chai.use(chaiHttp);
const expect = chai.expect;
const secret = process.env.JWT_SECRET || "testmode";
const token = sign({ username: "test" }, secret, { expiresIn: "7d" });
const invalidToken = sign({ username: "test" }, "invalidSecret", {
	expiresIn: "7d",
});

const postTests = [
	{
		code: 500,
		description: "Testing to post without required field 'title'",
		markdown: "hej",
		errMsg:
			"Post validation failed: slug: Path `slug` is required., title: Path `title` is required.",
		errTitle: "ValidationError",
		token,
	},
	{
		code: 500,
		description: "Testing to post without required field 'markdown'",
		title: "no markdown",
		errTitle: "ValidationError",
		token,
		errMsg:
			"Post validation failed: sanitizedHtml: Path `sanitizedHtml` is required., markdown: Path `markdown` is required.",
	},
	{
		code: 200,
		title: "new post",
		slug: "new-post",
		description: "Succesfully creating a new post at POST '/post'",
		markdown: "New post",
		token,
	},
	{
		code: 401,
		title: "new post",
		slug: "new-post",
		description: "Trying invalid token",
		token: invalidToken,
		errTitle: "Invalid token",
	},
];

describe("testing blog POST at /post", () => {
	postTests.forEach((test) => {
		it(test.description, (done) => {
			chai
				.request(app)
				.post(`/post`)
				.set("content-type", "application/x-www-form-urlencoded")
				.set("x-access-token", test.token)
				.send({ title: test.title, markdown: test.markdown })
				.end((err: any, res: any) => {
					expect(res.statusCode).to.be.equal(test.code);
					expect(res.body).to.be.an("object");

					if (test.errTitle) {
						expect(res.body.error.description, test.errMsg);
						expect(res.body.error.title).to.equal(test.errTitle);
					} else {
						expect(res.body.title).to.equal(test.title);
						expect(res.body.markdown).to.equal(test.markdown);
						expect(res.body.slug).to.equal(test.slug);
						expect(res.body.sanitizedHtml).to.equal(
							`<p>${res.body.markdown}</p>\n`
						);
					}
					done();
				});
		});
	});
});
