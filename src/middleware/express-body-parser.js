const express = require("express");

module.exports = (app) => {
  // body parsing middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
};
