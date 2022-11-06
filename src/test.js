const fs = require("fs");

async function main() {
//    const zip = fs.readFileSync("./src/tetris.zip", 'hex');
//
//    const resp = await fetch("http://localhost:3000/game", {
//        method: 'POST',
//        body: JSON.stringify({
//            title: "Tetris",
//            author: "Jim Phieffer",
//            file: zip
//        }),
//        headers: {
//            "Content-Type": "application/json"
//        }
//    })
//    console.log(await resp.json())

    const id = 'bc88d5fad278c9375f32a9eacdacfed35fe64930ba6dd633c2bc3924484b6654';
    const key = 'e0218fa4e476173a1e37365a339756c5049dfe3b2034252ec67ad3c16a4635e3';
    const resp = await fetch(`http://localhost:3000/game/${id}/${key}`)
    const json = await resp.json();
    console.log(`Title: ${json.title}`);
    console.log(`Author: ${json.author}`);
    fs.writeFileSync("new.zip", Buffer.from(json.file, "hex"));
}

main();