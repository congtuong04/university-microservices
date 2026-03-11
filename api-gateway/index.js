require("dotenv").config();

const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");

const app = express();

app.use(express.json());

/* REQUEST LOGGER */

app.use((req, res, next) => {
 console.log(`${req.method} ${req.originalUrl}`);
 next();
});

/* SERVICES */

const services = [
 {
  route: "/auth",
  target: process.env.AUTH_SERVICE_URL
 },
 {
  route: "/students",
  target: process.env.STUDENT_SERVICE_URL
 },
 {
  route: "/courses",
  target: process.env.COURSE_SERVICE_URL
 },
 {
  route: "/teachers",
  target: process.env.TEACHER_SERVICE_URL
 },
 {
  route: "/admins",
  target: process.env.ADMIN_SERVICE_URL
 }
];

/* PROXY */

services.forEach(service => {

 app.use(
  service.route,
  createProxyMiddleware({
   target: service.target,
   changeOrigin: true,
   pathRewrite: {
    [`^${service.route}`]: ""
   }
  })
 );

});

/* HEALTH CHECK */

app.get("/", (req, res) => {
 res.send("API Gateway Running");
});

/* ERROR HANDLER */

app.use((err, req, res, next) => {
 console.error(err);
 res.status(500).json({
  message: "Gateway Error"
 });
});

/* START SERVER */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
 console.log(`API Gateway running on port ${PORT}`);
});
