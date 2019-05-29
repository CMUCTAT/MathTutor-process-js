const winston = require('winston')
const Log = winston.createLogger({
    level: 'info',
    format: winston.format.simple(), // NEXT add comments
    transports: [
        new winston.transports.Console()
    ]
});

module.exports = Log;
