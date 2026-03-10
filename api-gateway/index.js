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
  target: "http://auth-service:5001"
 },
 {
  route: "/students",
  target: "http://student-service:5002"
 },
 {
  route: "/courses",
  target: "http://course-service:5003"
 },
 {
  route: "/teachers",
  target: "http://teacher-service:5004"
 },
 {
  route: "/admins",
  target: "http://admin-service:5005"
 }
];

/* PROXY */

services.forEach(service => {

 app.use(
  service.route,
  createProxyMiddleware({
   target: service.target,
   changeOrigin: true
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
