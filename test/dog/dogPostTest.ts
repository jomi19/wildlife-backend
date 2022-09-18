import app from "../../server";
import chai from "chai";
import chaiHttp from "chai-http";
import { sign } from "jsonwebtoken";
import { execPath, send } from "process";

chai.use(chaiHttp);
const expect = chai.expect;
const secret = process.env.JWT_SECRET || "testmode";
const token = sign({ username: "test" }, secret, { expiresIn: "7d" });
const invalidToken = sign({ username: "test" }, "invalidSecret", {
	expiresIn: "7d",
});

const dogPostTests = [
	{
		code: 500,
		case: "Trying to insert new dog without a dog name",
		error: "",
		token,
		body: {
			pictureUrl: "www.test.se",
			born: "2021-21-01",
			hd: "test",
			mh: {
				curiosity: 1,
				aggression: 2,
				social: 3,
				hunting: 4,
				playfulness: 5,
			},
			prices: "hej",
		},
	},

	{
		code: 200,
		case: "Successfully inserting a new dog",
		token,
		body: {
			born: "2021-01-01",
			newName: "Doglas",
			mh: {
				curiosity: 1,
				aggression: 2,
				social: 3,
				hunting: 4,
				playfulness: 5,
			},
		},
		fullName: "test",
	},
	{
		code: 500,
		case: "Inserting dog with over 5 in mh value",
		token,
		body: {
			born: "2021-01-01",
			newName: "Dognr2",
			mh: {
				curiosity: 1,
				aggression: 2,
				social: 3,
				hunting: 4,
				playfulness: 6,
			},
		},
	},
];

describe("Testing POST at /dog", () => {
	dogPostTests.forEach((test) => {
		it(test.case, (done) => {
			chai
				.request(app)
				.post("/dog")
				.set("content-type", "application/json")
				.set("x-access-token", test.token)
				.send(test.body)
				.end((err: any, res: any) => {
					expect(res.statusCode).to.be.equal(test.code);
					done();
				});
		});
	});
});
