import app from "../../server";
import chai from "chai";
import chaiHttp from "chai-http";
import { assert } from "console";
chai.use(chaiHttp);
const expect = chai.expect;

const getTests = [
	{
		code: 200,
		slug: "test",
		title: "testar",
		description: "Testing to find an existing post at /post",
	},
	{
		code: 404,
		slug: "idonotexist",
		title: "Wrong slug",
		errorMsg: "Cannot find any posts with that slug",
		description: "Testing to find an post with an no existing slug",
	},
	{
		code: 404,
		title: "Wrong slug",
		errorMsg: "Cannot find any posts with that slug",
		description: "Testing to find a post with no slug",
	},
];

const postTests = [];

describe("testing blog GET at /post and /post/all", () => {
	it("Testing to fetch all posts at /post/all", (done) => {
		chai
			.request(app)
			.get("/post/all")
			.then((res: any) => {
				expect(res.statusCode).to.be.equal(200);
				expect(res.body).to.be.an("array");
				expect(res.body[0].title).to.be.an("string");
				expect(res.body[0].markdown).to.be.an("string");
				expect(res.body[0].slug).to.be.an("string");
				expect(res.body[0].sanitizedHtml).to.be.an("string");
				done();
			});
	});
	getTests.forEach((test) => {
		it(test.description, (done) => {
			chai
				.request(app)
				.get(`/post?slug=${test.slug}`)
				.end((err: any, res: any) => {
					expect(res.statusCode).to.be.equal(test.code);
					expect(res.body).to.be.an("object");

					if (test.errorMsg) {
						expect(res.body.error.description, test.errorMsg);
						expect(res.body.error.title).to.equal(test.title);
					} else {
						expect(res.body.title).to.equal(test.title);
					}
					done();
				});
		});
	});
});
