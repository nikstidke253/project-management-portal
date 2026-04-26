const { Project, Client, User } = require('../models');

const getProjects = async (req, res) => {
    try {
        let where = {};
        
        if (req.user.role === 'client') {
            const client = await Client.findOne({ where: { email: req.user.email } });
            if (client) {
                where.clientId = client.id;
            }
        }
        
        if (req.user.role === 'user') {
            where.assignedTo = req.user.id;
        }
        
        const projects = await Project.findAll({
            where,
            include: [
                { model: Client, attributes: ['companyName', 'contactPerson'] },
                { model: User, attributes: ['name', 'email'] }
            ]
        });
        
        res.json({ success: true, projects });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getProject = async (req, res) => {
    try {
        const project = await Project.findByPk(req.params.id, {
            include: [
                { model: Client, attributes: ['companyName', 'contactPerson'] },
                { model: User, attributes: ['name', 'email'] }
            ]
        });
        
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }
        
        res.json({ success: true, project });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createProject = async (req, res) => {
    try {
        const project = await Project.create(req.body);
        res.status(201).json({ success: true, project });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateProject = async (req, res) => {
    try {
        const project = await Project.findByPk(req.params.id);
        
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }
        
        if (req.user.role === 'client') {
            const { status } = req.body;
            await project.update({ status });
        } else {
            await project.update(req.body);
        }
        
        res.json({ success: true, project });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteProject = async (req, res) => {
    try {
        const project = await Project.findByPk(req.params.id);
        
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }
        
        await project.destroy();
        res.json({ success: true, message: 'Project deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getProjects, getProject, createProject, updateProject, deleteProject };