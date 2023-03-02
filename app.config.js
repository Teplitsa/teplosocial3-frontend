const HostName = "teplosocial.tep";
const BaseUrl = `http://${HostName}`;

const appConfig = {
  BaseUrl,
  AjaxUrl: `${BaseUrl}/wp-admin/admin-ajax.php`,
  LoginUrl: `${BaseUrl}/simsim`,
  RestApiUrl: `${BaseUrl}/wp-json`,
  AuthTokenLifeTimeMs: 600,
  MongoConnection: "mongodb://teplosocial-mongo:27017",
  NotificationMicroserviceUrl: `ws://${HostName}:5000`,
  NotificationRestfulServiceUrl: `${BaseUrl}:5000/api/v1/notifications`,
};

module.exports = appConfig;
