'use strict';

// Development specific configuration
// ==================================
module.exports = {
  // MongoDB connection options
  mongo: {
//    uri: 'mongodb://localhost:27017/melt-dev'
		uri: 'mongodb://no2luser:password123@ds035290.mongolab.com:35290/atomic-dev'
  },

  seedDB: true
};
