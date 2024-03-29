const HostName = "kurst.org";
const BaseUrl = `https://${HostName}`;

const appConfig = {
    BaseUrl,
    AjaxUrl: `${BaseUrl}/wp-admin/admin-ajax.php`,
    LoginUrl: `${BaseUrl}/simsim`,
    RestApiUrl: `${BaseUrl}/wp-json`,
    AuthTokenLifeTimeMs: 600,
    MongoConnection: "mongodb://localhost:27017",
    NotificationMicroserviceUrl: `wss://${HostName}:5000`,
    NotificationRestfulServiceUrl: `${BaseUrl}:5000/api/v1/notifications`,
};

module.exports = appConfig;
