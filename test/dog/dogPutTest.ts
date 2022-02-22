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

const dogPutTests = [
	{
		case: "Trying to update with a dog that do not exist",
		code: 404,
		body: {
			name: "donotexist",
			born: "2020-01-01",
		},
		token,
		error: "Could not find the dog",
	},
	{
		case: "Updating dog with all new fields",
		code: 200,
		body: {
			name: "storm",
			pictureUrl: "www.newimage.com",
			born: "1990-01-01",
			hd: "Testing hd",
			prices: "All prices",
			mh: {
				playfulness: 5,
				hunting: 5,
				aggression: 5,
				curiosity: 5,
				social: 5,
			},
		},
		token,
	},
];

describe("Testing PUT at /dog", () => {
	dogPutTests.forEach((test) => {
		it(test.case, (done) => {
			chai
				.request(app)
				.put("/dog")
				.set("content-type", "application/json")
				.set("x-access-token", test.token)
				.send(test.body)
				.end((err: any, res: any) => {
					expect(res.statusCode).to.be.equal(test.code);
					if (test.error) expect(res.body.error.name).to.be.equal(test.error);
					else {
						if (test.body.mh) {
							expect(res.body.mh.social).to.be.equal(test.body.mh.social);
						}
						if (test.body.born)
							expect(res.body.born.split("T")[0]).to.be.equal(test.body.born);
						if (test.body.pictureUrl)
							expect(res.body.pictureUrl).to.be.equal(test.body.pictureUrl);
						if (test.body.prices) expect(`<p>${test.body.prices}</p>`);
					}
					done();
				});
		});
	});
});
