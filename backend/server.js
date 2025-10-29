require('dotenv').config();
const connectDB = require('./src/db/db');
const app = require('./src/app');
const serverless = require("serverless-http");
connectDB();


module.exports = app;
module.exports.handler = serverless(app);

// Run locally (only if called directly with `node server.js`)
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}


// app.listen(3000,()=>{
//     console.log("server is running");
// })