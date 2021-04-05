const express = require('express');
const path = require('path');
const app = express();
const mongoose = require("mongoose");
const ejs = require("ejs");
const cookieParser = require("cookie-parser");
const requestIp = require('request-ip');
const chalk = require("chalk");
const config = require("./config.json");
const nocache = require('nocache');
const cors = require('cors');
var serverVersion = config.mode;
if (serverVersion == "development") {
  var dbSet = config.database.development;
};
if (serverVersion == "production") {
  var dbSet = config.database.production;
};

mongoose.connect(dbSet, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
}, () => {
  console.log(chalk.yellow('Successfully connected to the MongoDB database'))
})

app.set('view engine', 'ejs');
app.use(cookieParser());
app.use(nocache());
app.use(cors());
app.set('views', path.join(__dirname, '/views'));
app.use(express.static(path.join(__dirname, 'public')));

const linkSchema = new mongoose.Schema({
  link: String,
  slug: String,
  created_at: String,
  ip_created_on: String
})
const LinkModel = mongoose.model('Links', linkSchema);

const banSchema = new mongoose.Schema({
  ip: String,
  banned_at: String
})
const BanModel = mongoose.model('Bans', banSchema);

// Regular Routing
app.get('/', async (req, res) => {
  const clientIp = requestIp.getClientIp(req);
  let createBanEndpointExists = await BanModel.findOne({
    ip: clientIp
  });
  if (createBanEndpointExists) return res.render('banned', {
    foo: 'FOO'
  });
  res.render('index', {
    foo: 'FOO'
  });
});

app.get('/:slug', async (req, res) => {
  let searchEndpointExists = await LinkModel.findOne({
    slug: req.params.slug
  });
  if (!searchEndpointExists) return res.render('notfound', {
    foo: 'FOO'
  });
  let searchBanEndpointExists = await BanModel.findOne({
    ip: searchEndpointExists.ip_created_on
  });
  if (searchBanEndpointExists) {
    if (searchBanEndpointExists.ip == searchEndpointExists.ip_created_on) return res.render('notfound', {
      foo: 'FOO'
    });
  }
  res.render('redirect', {
    redirect: searchEndpointExists.link
  });
});

// API
app.post('/api/create', async (req, res) => {
  if (!req.query.link || !req.query.slug) return res.json({
    error: true,
    message: "You must provide a link and a slug",
    code: 400
  });
  let createEndpointExists = await LinkModel.findOne({
    slug: req.query.slug
  });
  const clientIp = requestIp.getClientIp(req);
  let createBanEndpointExists = await BanModel.findOne({
    ip: clientIp
  });
  if (createBanEndpointExists) return res.json({
      error: true,
      message: "IP banned",
      code: 410
  });
  if (createEndpointExists) return res.json({
    error: true,
    message: "Slug already exists",
    code: 403
  });
  const linkData = await LinkModel.create({
    link: req.query.link,
    slug: req.query.slug,
    created_at: new Date().toISOString(),
    ip_created_on: clientIp
  });
  return res.json({
    error: false,
    link: req.query.link,
    slug: req.query.slug,
    created_at: linkData.created_at,
    code: 200
  });
});
app.get('/api/ban', async (req, res) => {
  if (!req.query.ip || !req.query.staffkey) return res.json({
    error: true,
    message: "You must provide a valid IP address & staffkey",
    code: 400
  });
  if (req.query.staffkey !== config.staffkey) return res.json({
    error: true,
    message: "staffkey is invalid",
    code: 403
  });
  let banEndpointExists = await BanModel.findOne({
    ip: req.query.ip
  });
  if (banEndpointExists) return res.json({
    error: true,
    message: "IP already banned",
    code: 403
  });
  const ban = await BanModel.create({
    ip: req.query.ip,
    banned_at: new Date().toISOString()
  });
  return res.json({
    error: false,
    ip: req.query.ip,
    banned: true,
    code: 200
  });
});
app.get('/api/link/:id', async (req, res) => {
  if (!req.params.id) return res.json({
    error: true,
    message: "You must provide a slug",
    code: 400
  });
  let linkEndpointExists = await LinkModel.findOne({
    slug: req.params.id
  });
  if (!linkEndpointExists) return res.json({
    error: true,
    message: "Slug not found",
    code: 404
  });
  let linkBanEndpointExists = await BanModel.findOne({
    ip: linkEndpointExists.ip_created_on
  });
  if (linkBanEndpointExists) {
    if (linkBanEndpointExists.ip == linkEndpointExists.ip_created_on) return res.json({
      error: true,
      message: "Slug banned",
      code: 410
    });
  }
  return res.json({
    error: false,
    link: linkEndpointExists.link,
    slug: linkEndpointExists.slug,
    created_at: linkEndpointExists.created_at,
    code: 200
  });
});

app.listen(config.port, () => {
  console.log(chalk.blue('OpenLink launched on port ' + chalk.bold.blue.underline(config.port)));
})
