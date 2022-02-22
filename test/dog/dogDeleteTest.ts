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

// {
//     case: "dog",
//     code: 0
//     body: { }
//     token:
// }

const dogDeleteTests = [
	{
		body: {
			name: "donotexist",
		},
		token,
		error: "Could not find the dog",
		code: 404,
		case: "Trying to delete an non existing dog",
	},
	{
		body: {
			name: "aiko",
		},
		token,
		case: "Successfully deleting a dog",
		code: 204,
	},
	{
		body: { name: "storm" },
		token: invalidToken,
		case: "Tryng to delete a dog with invalid token",
		error: "Invalid token",
		code: 401,
	},
];

describe("Testing DELETE at /dog", () => {
	dogDeleteTests.forEach((test) => {
		it(test.case, (done) => {
			chai
				.request(app)
				.delete("/dog")
				.set("content-type", "application/json")
				.set("x-access-token", test.token)
				.send(test.body)
				.end((err: any, res: any) => {
					expect(res.statusCode).to.be.equal(test.code);
					if (test.error) expect(res.body.error.name).to.be.equal(test.error);
					done();
				});
		});
	});
});
