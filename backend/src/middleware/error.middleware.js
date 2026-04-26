const errorHandler = (err, req, res, next) => {
    let error = { ...err };
    error.message = err.message;
    
    console.error(err);
    
    // Sequelize validation error
    if (err.name === 'SequelizeValidationError') {
        const message = Object.values(err.errors).map(val => val.message).join(', ');
        error = { status: 400, message };
    }
    
    // Sequelize unique constraint error
    if (err.name === 'SequelizeUniqueConstraintError') {
        error = { status: 400, message: 'Duplicate field value entered' };
    }
    
    res.status(error.status || 500).json({
        success: false,
        message: error.message || 'Server Error'
    });
};

module.exports = errorHandler;