const { Client, Project } = require('../models');

const getClients = async (req, res) => {
    try {
        const clients = await Client.findAll({
            include: [{ model: Project }]
        });
        res.json({ success: true, clients });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getClient = async (req, res) => {
    try {
        const client = await Client.findByPk(req.params.id, {
            include: [{ model: Project }]
        });
        
        if (!client) {
            return res.status(404).json({ message: 'Client not found' });
        }
        
        res.json({ success: true, client });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createClient = async (req, res) => {
    try {
        const client = await Client.create(req.body);
        res.status(201).json({ success: true, client });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateClient = async (req, res) => {
    try {
        const client = await Client.findByPk(req.params.id);
        
        if (!client) {
            return res.status(404).json({ message: 'Client not found' });
        }
        
        await client.update(req.body);
        res.json({ success: true, client });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteClient = async (req, res) => {
    try {
        const client = await Client.findByPk(req.params.id);
        
        if (!client) {
            return res.status(404).json({ message: 'Client not found' });
        }
        
        await client.destroy();
        res.json({ success: true, message: 'Client deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getClients, getClient, createClient, updateClient, deleteClient };