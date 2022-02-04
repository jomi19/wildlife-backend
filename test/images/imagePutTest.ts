import app from "../../server";
import chai from "chai";
import chaiHttp from "chai-http";
import { assert } from "console";
//TODO: Need more tests

chai.use(chaiHttp);
const expect = chai.expect;

const tests = [
	{
		code: 200,
		case: "Updating tags",
		tags: "storm",
		id: "f7799412-3ef3-42f8-bb88-d2bdf8c87ff4",
		tagArray: ["storm"],
	},
	{
		code: 404,
		case: "Trying to find with an nonexisting id",
		id: "f7799412-3ef3-42f8-bb88-d2bdf8c87fd4",
		error: "Cant find that image",
	},
	{
		code: 200,
		case: "Editing image description",
		description: "succesfull edit",
		id: "f7799412-3ef3-42f8-bb88-d2bdf8c87ff4",
	},
	{
		code: 200,
		case: "Editing both tags and description",
		description: "Editing both",
		tags: "ajax,storm,aiko",
		tagArray: ["ajax", "storm", "aiko"],
		id: "fc789a88-673a-4cf9-ac0a-a13378177d21",
	},
];

describe("testing blog PUT at /image", () => {
	tests.forEach((test) => {
		it(test.case, (done) => {
			chai
				.request(app)
				.put(`/image`)
				.set("content-type", "application/x-www-form-urlencoded")
				.send({
					tags: test.tags,
					description: test.description,
					id: test.id,
				})
				.end((err: any, res: any) => {
					const { tags, description } = res.body;
					expect(res.statusCode).to.be.equal(test.code);
					expect(res.body).to.be.an("object");
					if (test.error) {
						expect(res.body.error.name, test.error);
					} else {
						if (test.tags) {
							for (let x = 0; x < test.tagArray.length, x++; ) {
								expect(res.body.tag[x]).to.be.equal(test.tagArray[x]);
							}
						}
						if (test.description)
							expect(description).to.be.equal(test.description);
					}
					done();
				});
		});
	});
});
