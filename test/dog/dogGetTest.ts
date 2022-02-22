import app from "../../server";
import chai from "chai";
import chaiHttp from "chai-http";

chai.use(chaiHttp);
const expect = chai.expect;

const dogPostTests = [
	{
		name: "storm",
		case: "Getting dog successfully",
		code: 200,
	},
	{
		name: "donotexist",
		case: "Trying to get a dog that dont exist",
		code: 404,
		error: "Could not find the dog",
	},
];

describe("Testing GET at /dog and /dog/all", () => {
	dogPostTests.forEach((test) => {
		it(test.case, (done) => {
			chai
				.request(app)
				.get(`/dog?name=${test.name}`)
				.end((err: any, res: any) => {
					expect(res.statusCode).to.be.equal(test.code);
					if (test.error) expect(test.error).to.be.equal(res.body.error.name);
					else expect(test.name).to.be.equal(res.body.name.toLowerCase());
					done();
				});
		});
	});

	it("Testing GET /dog/all", (done) => {
		chai
			.request(app)
			.get("/dog/all")
			.end((err: any, res: any) => {
				expect(res.statusCode).to.be.equal(200);
				expect(res.body).to.be.an("array");
				done();
			});
	});
});
