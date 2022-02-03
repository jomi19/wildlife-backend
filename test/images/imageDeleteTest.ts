import app from "../../server";
import chai from "chai";
import chaiHttp from "chai-http";
import { assert } from "console";
chai.use(chaiHttp);
const expect = chai.expect;

const postTests = [
	{
		code: 204,
		id: "fc789a88-673a-4cf9-ac0a-a13378177d22",
		description: "ID",
	},
];

describe("Testing DELETE at /image", () => {
	postTests.forEach((test) => {
		it(test.description, (done) => {
			chai
				.request(app)
				.delete("/image")
				.set("content-type", "application/x-www-form-urlencoded")
				.send({ id: test.id })
				.end((err: any, res: any) => {
					expect(res.statusCode).to.be.equal(test.code);
					// if (test.errorMsg) {
					// 	expect(res.body.error.message, test.errorMsg);
					// 	expect(res.body.error.name).to.equal(test.title);
					// 	console.log(res.body.error);
					// }
					done();
				});
		});
	});
});
