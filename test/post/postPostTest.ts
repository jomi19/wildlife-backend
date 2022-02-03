import app from "../../server";
import chai from "chai";
import chaiHttp from "chai-http";
import { assert } from "console";
chai.use(chaiHttp);
const expect = chai.expect;

const postTests = [
	{
		code: 500,
		description: "Testing to post without required field 'title'",
		markdown: "hej",
		errMsg:
			"Post validation failed: slug: Path `slug` is required., title: Path `title` is required.",
		errTitle: "ValidationError",
	},
	{
		code: 500,
		description: "Testing to post without required field 'markdown'",
		title: "no markdown",
		errTitle: "ValidationError",
		errMsg:
			"Post validation failed: sanitizedHtml: Path `sanitizedHtml` is required., markdown: Path `markdown` is required.",
	},
	{
		code: 200,
		title: "new post",
		slug: "new-post",
		description: "Succesfully creating a new post at POST '/post'",
		markdown: "New post",
	},
];

describe("testing blog POST at /post", () => {
	postTests.forEach((test) => {
		it(test.description, (done) => {
			chai
				.request(app)
				.post(`/post`)
				.set("content-type", "application/x-www-form-urlencoded")
				.send({ title: test.title, markdown: test.markdown })
				.end((err: any, res: any) => {
					expect(res.statusCode).to.be.equal(test.code);
					expect(res.body).to.be.an("object");

					if (test.errMsg) {
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
