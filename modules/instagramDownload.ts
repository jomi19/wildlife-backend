// import fs from "fs";
// import request from "request";

// function download(uri: string, filename: string, callback: function) {
// 	request.head(uri, function (err: any, res: any, body: any) {
// 		console.log("content-type:", res.headers["content-type"]);
// 		console.log("content-length:", res.headers["content-length"]);

// 		request(uri).pipe(fs.createWriteStream(filename)).on("close", callback);
// 	});
// }

// download(
// 	"https://scontent-arn2-1.cdninstagram.com/v/t51.2885-15/sh0.08/e35/s640x640/272114393_3145626669017725_4781354396846516782_n.webp.jpg?_nc_ht=scontent-arn2-1.cdninstagram.com&_nc_cat=101&_nc_ohc=X4Ark36oyd0AX8BpWxy&edm=ABfd0MgBAAAA&ccb=7-4&oh=00_AT-CvknIPt_hWuDtEV6Jz_rMLSkkz4EtXBkpv3knKjeifQ&oe=61F3BEE1&_nc_sid=7bff83",
// 	"./img/test.jpg",
// 	function () {
// 		console.log("image saved");
// 	}
// );
