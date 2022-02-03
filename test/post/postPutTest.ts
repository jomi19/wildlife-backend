import app from "../../server";
import chai from "chai";
import chaiHttp from "chai-http";
import { assert } from "console";
chai.use(chaiHttp);
const expect = chai.expect;

const postTests = [
	{
		code: 404,
		description: "Testing to update an post that dont exist",
		slug: "i-do-not-exist",
		markdown: "hej",
		title: "test",
		errMsg: "Cant find an post with that slug or slug missing",
		errTitle: "Cannot find",
	},
	{
		code: 200,
		description: "Testing to update a post with empty markdown and title field",
		slug: "test",
		title: "",
		markdown: "",
	},
	{
		code: 200,
		description: "Editing a post title and markdown successfully",
		title: "succesfull edit",
		slug: "test",
		markdown: "succesfully edited post in PUTTEST",
	},
];

describe("testing blog PUT at /post", () => {
	postTests.forEach((test) => {
		it(test.description, (done) => {
			chai
				.request(app)
				.put(`/post`)
				.set("content-type", "application/x-www-form-urlencoded")
				.send({ title: test.title, markdown: test.markdown, slug: test.slug })
				.end((err: any, res: any) => {
					expect(res.statusCode).to.be.equal(test.code);
					expect(res.body).to.be.an("object");

					if (test.errMsg) {
						expect(res.body.error.description, test.errMsg);
						expect(res.body.error.title).to.equal(test.errTitle);
					} else {
						if (test.title === "") {
							expect(res.body.title).to.not.equal(test.title);
							expect(res.body.markdown).to.not.equal(test.markdown);
						} else {
							expect(res.body.title).to.equal(test.title);
							expect(res.body.markdown).to.equal(test.markdown);
						}
						expect(res.body.sanitizedHtml).to.equal(
							`<p>${res.body.markdown}</p>\n`
						);
						expect(res.body.slug).to.equal(test.slug);
					}
					done();
				});
		});
	});
});
