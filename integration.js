const db = require('ibm_db');
const URL = 'DATABASE=BLUDB;HOSTNAME=dashdb-txn-sbox-yp-lon02-01.services.eu-gb.bluemix.net;PORT=50000;PROTOCOL=TCPIP;UID=vrj51280;PWD=kd7l76c81-81v28q;';

const INSERT = 'INSERT INTO person (ssn, name, surname, username, password, role_id, email) VALUES (?, ?, ?, ?, ?, ?, ?)';
const ROLE = 'INSERT INTO role (role_id, name) VALUES (?, ?)';

class Database {
  constructor() {
    this.connection_ = db.openSync(URL);
  }

  Connect(err, conn) {
    if (err) {
      return console.log(err);
    }
    this.connection_ = conn;
  }

  async AddUser(data, cb) {
		console.log('Auth Integration');
    var binds = [
      data.ssn,
      data.name,
      data.surname,
      data.username,
      data.password,
      data.role_id,
      data.email
    ];
    console.log(binds);
    return this.connection_.querySync(INSERT, binds);
  }
}

module.exports = new Database();
