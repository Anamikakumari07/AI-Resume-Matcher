const dns = require("node:dns").promises;

async function test() {
    try {
        console.log("Testing DNS...");

        const result = await dns.resolveSrv(
            "_mongodb._tcp.cluster0.546bwip.mongodb.net"
        );

        console.log(result);
    } catch (err) {
        console.error(err);
    }
}

test();