Meteor.publish('Texts', function () {
  return Texts.find({});
});