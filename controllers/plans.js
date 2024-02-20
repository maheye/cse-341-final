const mongodb = require('../data/database');
const ObjectId = require('mongodb').ObjectId;

const getAllPlanEntries = async (req, res) => {
    //#swagger.tags=['plans']
    try {
        const result = await mongodb.getDatabase().db().collection('plans').find();
        result.toArray().then((plans) => {
            res.setHeader('Content-Type', 'application/json');
            res.status(200).json(plans);
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const getPlanEntryById = async (req, res) => {
    //#swagger.tags=['plans']
    const planId = req.params.id;
    if (!ObjectId.isValid(planId)) {
        return res.status(400).json({ error: 'Invalid plan ID' });
    }

    try {
        const cursor = await mongodb.getDatabase().db().collection('plans').find({ _id: new ObjectId(planId) });

        cursor.toArray().then((plans) => {

            if (plans.length === 0) {
                return res.status(404).json({ error: 'plan not found' });
            }
            res.setHeader('Content-Type', 'application/json');
            res.status(200).json(plans[0]);
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const createPlanEntry = async (req, res) => {
    //#swagger.tags=['plans']
    const { 
        user_id,  
        event_id,
        plan_type,
        plan,
        schedule
    } = req.body;

    if (!user_id || !event_id || !plan_type || !plan || !schedule) {
        return res.status(400).json({ error: "user_id, event_id, plan_type, plan and schedule are required fields." });
    }

    const newPlan = {
        user_id,  
        event_id,
        plan_type,
        plan,
        schedule
    };
    
    try {
        const response = await mongodb.getDatabase().db()
            .collection('plans')
            .insertOne(newPlan);

        if (response.acknowledged) {
            return res.status(201).json({ message: 'Plan successfully created', plan: newPlan });// Successfully created
        } else {
            return res.status(500).json('Some error occurred while creating the plan.');// Internal server error
        }
    } catch (error) {
        return res.status(500).json(error.message || 'Some error occurred while creating the plan.');// Internal server error
    }
};

const updatePlanEntryById = async (req, res) => {
    //#swagger.tags=['plans']
    const planId = new ObjectId(req.params.id);
    const { 
        user_id,  
        event_id,
        plan_type,
        plan,
        schedule
    } = req.body;

    if (!user_id || !event_id || !plan_type || !plan || !schedule) {
        return res.status(400).json({ error: "user_id, event_id, plan_type, plan and schedule are required fields." });
    }

    const updatedPlan = {
        user_id,  
        event_id,
        plan_type,
        plan,
        schedule
    };

    try {
        const response = await mongodb.getDatabase().db().collection('plans').replaceOne({ _id: planId }, updatedPlan);

        if (response.modifiedCount > 0) {
            return res.status(200).json({ message: 'Plan successfully updated', plan: updatedPlan});
        } else {
            return res.status(404).json({ error: "Plan not found." });
        }
    } catch (error) {
        return res.status(500).json(error.message || 'Some error occurred while updating the plan.'); 
    }
};

const deletePlanEntryById = async (req, res) => {
    //#swagger.tags=['plans']
    try {
        const planId = new ObjectId(req.params.id);
        const response = await mongodb.getDatabase().db().collection('plans').deleteOne({ _id: planId });
        if (response.deletedCount > 0) {
            res.status(200).json({ message: 'Plan successfully deleted'});
        } else {
            res.status(404).json(response.error || 'Some error occurred while deleting the plan.');
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const getPlanEntriesByUserId = async (req, res) => {
    //#swagger.tags=['plans']
    const { user_id } = req.params;
    
    if (!user_id) {
        return res.status(400).json({ error: 'user_id is required' });
    }
    
    try {
        const journals = await mongodb.getDatabase()
            .db()
            .collection('plans')
            .find({ user_id: user_id })
            .toArray();

        if (journals.length === 0) {
            return res.status(404).json({ error: 'No plans found for the provided user_id' });
        }

        res.status(200).json(journals);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const getPlanEntriesByUserIdAndEventId = async (req, res) => {
    //#swagger.tags=['plans']
    const { user_id, event_id } = req.params;
    if (!user_id || !event_id) {
        return res.status(400).json({ error: 'user_id and event_id are required' });
    }
    try {
        const plans = await mongodb.getDatabase().db().collection('plans').find({ user_id, event_id }).toArray();
        res.status(200).json(plans);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = {
    getAllPlanEntries,
    getPlanEntryById,
    createPlanEntry,
    updatePlanEntryById,
    deletePlanEntryById,
    getPlanEntriesByUserId,
    getPlanEntriesByUserIdAndEventId
};