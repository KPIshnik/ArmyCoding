const connectionConfig = {
    host: process.env.HOST || "localhost",    
    port: process.env.PORT || 3000,    
    };   
    
    module.exports.PORT = connectionConfig.port;    
    module.exports.HOST = connectionConfig.host;