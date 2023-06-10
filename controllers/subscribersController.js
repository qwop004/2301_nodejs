// controllers/subscribersController.js
"use strict";

const Subscriber = require("../models/Subscriber");

module.exports = {
  index: (req, res, next) => {
    Subscriber.find()
      .then((subscribers) => {
        res.locals.subscribers = subscribers;
        next();
      })
      .catch((error) => {
        console.log(`Error fetching subscribers: ${error.message}`);
        next(error);
      });
  },
  indexView: (req, res) => {
    res.render("subscribers/index", {
      page: "subscribers",
      title: "All Subscribers",
    });
  },

  new: (req, res) => {
    res.render("subscribers/new", {
      page: "new-subscriber",
      title: "New Subscriber",
    });
  },

  create: (req, res, next) => {
    let subscriberParams = {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      newsletter: req.body.newsletter,
      clubSite: req.body.clubSite, // 수정된 부분: clubSite 필드 추가
      clubName: req.body.clubName, // 수정된 부분: clubName 필드 추가
    };

    Subscriber.create(subscriberParams)
      .then((subscriber) => {
        res.locals.redirect = "/subscribers";
        res.locals.subscriber = subscriber;
        next();
      })
      .catch((error) => {
        console.log(`Error saving subscriber: ${error.message}`);
        next(error);
      });
  },

  redirectView: (req, res, next) => {
    let redirectPath = res.locals.redirect;
    if (redirectPath) res.redirect(redirectPath);
    else next();
  },

  show: (req, res, next) => {
    let subscriberId = req.params.id;
    Subscriber.findById(subscriberId)
      .then((subscriber) => {
        res.locals.subscriber = subscriber;
        next();
      })
      .catch((error) => {
        console.log(`Error fetching subscriber by ID: ${error.message}`);
        next(error);
      });
  },

  showView: (req, res) => {
    res.render("subscribers/show", {
      page: "subscriber-details",
      title: "Subscriber Details",
    });
  },

  edit: (req, res, next) => {
    let subscriberId = req.params.id;
    Subscriber.findById(subscriberId)
      .then((subscriber) => {
        res.render("subscribers/edit", {
          subscriber: subscriber,
          page: subscriber.name,
          title: "Edit Subscriber",
        });
      })
      .catch((error) => {
        console.log(`Error fetching subscriber by ID: ${error.message}`);
        next(error);
      });
  },

  update: (req, res, next) => {
    let subscriberId = req.params.id;
    let subscriberParams = {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      newsletter: req.body.newsletter,
      clubSite: req.body.clubSite, // 수정된 부분: clubSite 필드 추가
      clubName: req.body.clubName, // 수정된 부분: clubName 필드 추가
    };

    Subscriber.findByIdAndUpdate(subscriberId, { $set: subscriberParams })
      .then((subscriber) => {
        res.locals.redirect = `/subscribers/${subscriberId}`;
        res.locals.subscriber = subscriber;
        next();
      })
      .catch((error) => {
        console.log(`Error updating subscriber by ID: ${error.message}`);
        next(error);
      });
  },

  delete: (req, res, next) => {
    let subscriberId = req.params.id;
    Subscriber.findByIdAndRemove(subscriberId)
      .then(() => {
        res.locals.redirect = "/subscribers";
        next();
      })
      .catch((error) => {
        console.log(`Error deleting subscriber by ID: ${error.message}`);
        next();
      });
  },
};
 