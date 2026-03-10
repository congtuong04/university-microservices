const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");

const app = express();

/* ROUTES */

app.use("/auth",
 createProxyMiddleware({
  target:"http://auth-service:5001",
  changeOrigin:true
 })
);

app.use("/students",
 createProxyMiddleware({
  target:"http://student-service:5002",
  changeOrigin:true
 })
);

app.use("/courses",
 createProxyMiddleware({
  target:"http://course-service:5003",
  changeOrigin:true
 })
);

app.use("/teachers",
 createProxyMiddleware({
  target:"http://teacher-service:5004",
  changeOrigin:true
 })
);

app.use("/admins",
 createProxyMiddleware({
  target:"http://admin-service:5005",
  changeOrigin:true
 })
);

const PORT = process.env.PORT || 5000;

app.listen(PORT,()=>{
 console.log("API Gateway running on port " + PORT);
});
