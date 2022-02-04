import app from "../../server";
import chai from "chai";
import chaiHttp from "chai-http";
import { assert } from "console";
chai.use(chaiHttp);
const expect = chai.expect;
//TODO: need more tests

const postTests = [
	{
		code: 201,
		path: "./images/test.jpg",
		tags: ["aiko", "storm"],
		imgDescription: "en bild",
		description: "Testing to post an image with tags and a description",
	},
	// {
	// 	code: 400,
	// 	path: "./test/test.jpg",
	// 	title: "Wrong id",
	// 	errorMsg: "Not a valid uuid",
	// 	description: "Trying to find an image with an invalid uuid",
	// },
	// {
	// 	code: 400,
	// 	title: "Wrong id",
	// 	errorMsg: "Not a valid uuid",
	// 	description: "Testing to find a image with no id",
	// },
	// {
	// 	code: 404,
	// 	id: "f7799412-3ef3-42f8-bb88-d2bdf8c87fe4",
	// 	title: "Culdent find that image",
	// 	errorMsg: "Not a valid uuid",
	// 	description: "Cant find any image with that id",
	// },
];

describe("Testing POST at /image", () => {
	postTests.forEach((test) => {
		it(test.description, (done) => {
			chai
				.request(app)
				.post("/image")
				.attach("image", `${test.path}`)
				.field({ tags: test.tags, description: test.imgDescription })
				.end((err: any, res: any) => {
					expect(res.statusCode).to.be.equal(test.code);
					expect(res.body).to.be.an("object");
					// if (test.errorMsg) {
					// 	expect(res.body.error.message, test.errorMsg);
					// 	expect(res.body.error.name).to.equal(test.title);
					// 	console.log(res.body.error);
					// } else {
					// 	expect(res.body.path).to.equal(test.path);
					// 	expect(res.body.description).to.equal(test.imgDescription);
					// }
					done();
				});
		});
	});
});
