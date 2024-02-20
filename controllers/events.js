const mongodb = require('../data/database');
const ObjectId = require('mongodb').ObjectId;

const getAllEvents = async (req, res) => {
     //#swagger.tags=['events']
    try {
        const result = await mongodb.getDatabase().db().collection('events').find().toArray();
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(result);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

const getSingleEvent = async (req, res) => {
       //#swagger.tags=['events']
    try {
        const eventId = new ObjectId(req.params.id);
        const result = await mongodb.getDatabase().db().collection('events').find({ _id: eventId }).toArray();

        if (!result || result.length === 0) {
            res.status(404).json({ message: 'Event not found' });
            return;
        }

        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(result[0]);
    } catch (err) {
        res.status(400).json('Must use a valid event id to find an event.');
    }
};

const createEvent = async (req, res) => {
       //#swagger.tags=['events']
    const event = {
        eventName: req.body.eventName,
        date: req.body.date,
        time: req.body.time,
        location: req.body.location,
        organizer: req.body.organizer,
        description: req.body.description,
        attendeesLimit: req.body.attendeesLimit,
    };

    const response = await mongodb.getDatabase().db().collection('events').insertOne(event);
    if (response.acknowledged) {
        res.status(201).json(response);
    } else {
        res.status(500).json(response.error || "Some error ocurred while creating the event.");
    }
};

const updateEvent = async (req, res) => {
       //#swagger.tags=['events']
    if (!ObjectId.isValid(req.params.id)) {
        res.status(400).json('Must use a valid event id to update an event.');
        return;
    }

    const eventId = new ObjectId(req.params.id);
    const event = {
        eventName: req.body.eventName,
        date: req.body.date,
        time: req.body.time,
        location: req.body.location,
        organizer: req.body.organizer,
        description: req.body.description,
        attendeesLimit: req.body.attendeesLimit,
    };

    const response = await mongodb.getDatabase().db().collection('events').replaceOne({ _id: eventId }, event);
    if (response.modifiedCount > 0) {
        res.status(204).send();
    } else {
        res.status(500).json(response.error || "Some error ocurred while updating the event.");
    }
};

const deleteEvent = async (req, res) => {
       //#swagger.tags=['events']
    if (!ObjectId.isValid(req.params.id)) {
        res.status(400).json('Must use a valid event id to delete an event.');
        return;
    }

    const eventId = new ObjectId(req.params.id);
    const response = await mongodb.getDatabase().db().collection('events').deleteOne({ _id: eventId });
    
    if (response.deletedCount > 0) {
        res.status(204).send();
    } else {
        res.status(500).json(response.error || "Some error ocurred while deleting the event.");
    }
};

module.exports = {
    getAllEvents,
    getSingleEvent,
    createEvent,
    updateEvent,
    deleteEvent
};