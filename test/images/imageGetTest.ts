import app from "../../server";
import chai from "chai";
import chaiHttp from "chai-http";
import { assert } from "console";
chai.use(chaiHttp);
const expect = chai.expect;

const getTests = [
	{
		code: 200,
		id: "f7799412-3ef3-42f8-bb88-d2bdf8c87ff4",
		path: "images/test/test.jpg",
		description: "Testing to find an existing image at /image",
		imgDescription: "en bild",
	},
	{
		code: 400,
		id: 10,
		title: "Wrong id",
		errorMsg: "Not a valid uuid",
		description: "Trying to find an image with an invalid uuid",
	},
	{
		code: 400,
		title: "Wrong id",
		errorMsg: "Not a valid uuid",
		description: "Testing to find a image with no id",
	},
	{
		code: 404,
		id: "f7799412-3ef3-42f8-bb88-d2bdf8c87fe4",
		title: "Culdent find that image",
		errorMsg: "Not a valid uuid",
		description: "Cant find any image with that id",
	},
];

describe("testing image GET at /image and /image/all", () => {
	it("Trying to get all photos at /image/all", (done) => {
		chai
			.request(app)
			.get("/image/all")
			.then((res: any) => {
				expect(res.statusCode).to.be.equal(200);
				expect(res.body).to.be.an("array");
				expect(res.body[0].description).to.be.an("string");
				expect(res.body[0].tags).to.be.an("array");
				expect(res.body[0].path).to.be.an("string");
				done();
			});
	});

	getTests.forEach((test) => {
		it(test.description, (done) => {
			chai
				.request(app)
				.get(`/image?id=${test.id}`)
				.end((err: any, res: any) => {
					expect(res.statusCode).to.be.equal(test.code);
					expect(res.body).to.be.an("object");

					if (test.errorMsg) {
						expect(res.body.error.message, test.errorMsg);
						expect(res.body.error.name).to.equal(test.title);
					} else {
						expect(res.body.path).to.equal(test.path);
						expect(res.body.description).to.equal(test.imgDescription);
					}
					done();
				});
		});
	});
});
