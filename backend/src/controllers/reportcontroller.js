const { User, Client, Project, ActivityLog } = require('../models');
const { Op } = require('sequelize');

const getDashboardStats = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        
        const whereClause = {};
        if (startDate && endDate) {
            whereClause.createdAt = {
                [Op.between]: [new Date(startDate), new Date(endDate)]
            };
        }

        const stats = {
            totalUsers: await User.count({ where: whereClause }),
            totalClients: await Client.count({ where: whereClause }),
            totalProjects: await Project.count({ where: whereClause }),
            projectsByStatus: {
                pending: await Project.count({ where: { ...whereClause, status: 'pending' } }),
                'in-progress': await Project.count({ where: { ...whereClause, status: 'in-progress' } }),
                completed: await Project.count({ where: { ...whereClause, status: 'completed' } }),
                'on-hold': await Project.count({ where: { ...whereClause, status: 'on-hold' } })
            },
            recentActivities: await ActivityLog.findAll({
                limit: 10,
                order: [['createdAt', 'DESC']],
                include: [{ model: User, attributes: ['name', 'email'] }]
            })
        };
        
        res.json({ success: true, stats });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const exportReport = async (req, res) => {
    try {
        const projects = await Project.findAll({
            include: [{ model: Client, attributes: ['companyName'] }]
        });

        // Simple CSV generation
        const header = 'ID,Project Name,Client,Status,Priority,Start Date,End Date\n';
        const rows = projects.map(p => {
            return `${p.id},"${p.name}","${p.Client?.companyName || 'N/A'}",${p.status},${p.priority},${p.startDate || ''},${p.endDate || ''}`;
        }).join('\n');

        const csvContent = header + rows;

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=projects_report.csv');
        res.status(200).send(csvContent);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getDashboardStats, exportReport };