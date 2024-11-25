const { getEndpoints } = require('../models/endpoints-model.js');
const { selectTopics } = require('../models/topics-model');

  exports.getEndpoints = (req, res, next) => {
    getEndpoints().then((endpoints) => {
      res.status(200).send({ endpoints });
    });
  };

  exports.getTopics = (req, res, next) => {
    selectTopics().then((topics) => {
      res.status(200).send({ topics });
    });
  };