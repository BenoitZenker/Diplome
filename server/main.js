import { Meteor } from 'meteor/meteor';

import '/imports/api/server/publications.js';
import '/imports/api/methods.js';
import '/imports/api/time.js';
import '/imports/api/texts.js';

Meteor.startup(() => {
  // Update the current time
  Meteor.call('UpdateTime');
  // Add a new doc on each start.
  Time.insert({ time: new Date() });
  // Print the current time from the database
  console.log(`The time is now ${Time.findOne().time}`);
});