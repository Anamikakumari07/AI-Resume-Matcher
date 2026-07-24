const dns = require("dns").promises;

async function checkDNS() {
  try {
    const result = await dns.resolveSrv(
      "_mongodb._tcp.cluster0.546bwip.mongodb.net"
    );

    console.log("DNS Success:");
    console.log(result);
  } catch (err) {
    console.error("DNS Failed:");
    console.error(err);
  }
}

checkDNS();