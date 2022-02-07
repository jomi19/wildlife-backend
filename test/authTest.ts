import app from "./../server";
import chai from "chai";
import chaiHttp from "chai-http";
import { assert } from "console";
chai.use(chaiHttp);
const expect = chai.expect;

const getTests = [
	{
		code: 401,
		username: "test",
		password: undefined,
		case: "Trying to login without password",
		error: "Wrong password",
	},
	{
		code: 401,
		username: undefined,
		password: "test",
		case: "Trying to login without a username",
		error: "Could not find user",
	},
	{
		code: 401,
		username: "test",
		password: "wrongpass",
		case: "Trying to login with wrong password",
		error: "Wrong password",
	},
	{
		code: 401,
		username: "idonotexist",
		password: "test",
		case: "Trying to login with wrong username",
		error: "Could not find user",
	},
	{
		code: 200,
		username: "test",
		password: "test",
		case: "Succesfull login",
	},
];

describe("testing user post at /user", () => {
	getTests.forEach((test) => {
		it(test.case, (done) => {
			chai
				.request(app)
				.post(`/user`)
				.set("content-type", "application/json")
				.send({ username: test.username, password: test.password })
				.end((err: any, res: any) => {
					expect(res.statusCode).to.be.equal(test.code);
					expect(res.body).to.be.an("object");

					if (test.error) {
						expect(res.body.error.name).to.equal(test.error);
					} else {
						expect(res.body.token).to.be.an("string");
					}
					done();
				});
		});
	});
});
