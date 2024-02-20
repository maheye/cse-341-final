const validator = new require('../helpers/validate');

const saveUser = (req, res, next) => {
  const validationRule = {
    name: 'required|string',
    username: 'required|string',
    email: 'required|email',
    phone: 'required|string', 
    meetingStatus: 'required|string',
    eventID: 'required|string',
};
 
validator(req.body, validationRule, {}, (err, status) => {
    if (!status) {
      res.status(412).send({
        success: false,
        message: 'Validation failed',
        data: err
      });
    } else {
      next();
    }
  });
};

const saveEvent = (req, res, next) => {
  const validationRule = {
    eventName: 'required|string',
    date: 'required|string',
    time: 'required|string',
    location: 'required|string',
    organizer: 'required|string',
    description: 'required|string',
    attendeesLimit: 'required|integer',
};

validator(req.body, validationRule, {}, (err, status) => {
    if (!status) {
      res.status(412).send({
        success: false,
        message: 'Validation failed for event',
        data: err
      });
    } else {
      next();
    }
  });
};

module.exports = {
  saveUser,
  saveEvent
};