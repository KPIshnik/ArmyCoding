const email = require("./email");
const facebook = require("./facebook");
const google = require("./google");

class Auth {
  constructor(email, google, facebook) {
    this.email = email;
    this.google = google;
    this.facebook = facebook;
  }
}
module.exports = new Auth(email, google, facebook);
