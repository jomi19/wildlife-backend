function getDatabaseUrl(): string {
	console.log(process.env.NODE_ENV);
	if (process.env.NODE_ENV === "dev") {
		return "mongodb://localhost:27017/wildlifedev";
	}
	if (process.env.NODE_ENV === "test") {
		return "mongodb://localhost:27017/wildlifetest";
	}

	return "mongodb://localhost:27017/wildlife";
}

const DATABASE_URL = getDatabaseUrl();

export default DATABASE_URL;
