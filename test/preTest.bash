DATABASE="wildlifetest"

POSTTABLE="posts"
IMAGESTABLE="images"


POSTINSERTVALUE="[{title : 'testar', markdown: 'hej', slug: 'test', sanitizedHtml: 'hej', created: new Date()},{title : 'test2', markdown: 'hej2', slug: 'test2', sanitizedHtml: 'hej', created: new Date()}]"

IMAGESINSERTVALUE="[{path: 'images/test/test.jpg', description: 'en bild', tags: ['storm', 'aiko'], _id: 'f7799412-3ef3-42f8-bb88-d2bdf8c87ff4'}, {path: 'images/test/delete.jpg', description: 'andra bilden', _id: 'fc789a88-673a-4cf9-ac0a-a13378177d22'}]"

echo "Resetting test folders and database $DATABASE."
mongo $DATABASE --eval "printjson(db.dropDatabase())"
rm -r ./images/test
mkdir ./images/test

echo "Setting up test blog posts into $POSTTABLE and adding"
mongo $DATABASE --eval "printjson(db.$POSTTABLE.insertMany($POSTINSERTVALUE))"

echo "Copying images to test folder"
cp ./images/test.jpg ./images/test/test.jpg
cp ./images/test.jpg ./images/test/delete.jpg
echo "Setting up test images into $IMAGESTABLE"
mongo $DATABASE --eval "printjson(db.$IMAGESTABLE.insertMany($IMAGESINSERTVALUE))"
