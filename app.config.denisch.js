const BaseUrl = "http://teplosocial.tep";

const appConfig = {
  BaseUrl,
  AjaxUrl: `${BaseUrl}/wp-admin/admin-ajax.php`,
  LoginUrl: `${BaseUrl}/simsim`,
  RestApiUrl: `${BaseUrl}/wp-json`,
  AuthTokenLifeTimeMs: 600,
  MongoConnection: "mongodb://mongo.db:27017",
};

module.exports = appConfig;
