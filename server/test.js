const mongoose = require("mongoose");

const uri =
  "mongodb+srv://anamika:Anamika123@cluster0.546bwip.mongodb.net/ai-resume-matcher?retryWrites=true&w=majority&appName=Cluster0";

mongoose
  .connect(uri)
  .then(() => {
    console.log("✅ MongoDB Connected Successfully");
    process.exit(0);
  })
  .catch((err) => {
    console.log("❌ Error:");
    console.log(err);
    process.exit(1);
  });