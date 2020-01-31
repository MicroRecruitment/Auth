const db = require('ibm_db');
const URL = 'DATABASE=BLUDB;HOSTNAME=dashdb-txn-sbox-yp-lon02-01.services.eu-gb.bluemix.net;PORT=50000;PROTOCOL=TCPIP;UID=vrj51280;PWD=kd7l76c81-81v28q;';

const INSERT = 'INSERT INTO person (ssn, name, surname, username, password, role_id, email) VALUES (?, ?, ?, ?, ?, ?, ?)';
const GET_USER = 'SELECT * FROM person WHERE username = ? AND password = ?';

class Database {
  constructor() {
    this.connection_ = db.openSync(URL);
  }

  async AddUser(data) {
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

  async GetUser(login_data) {
    var binds = [
      login_data.username,
      login_data.password
    ];
    return this.connection_.querySync(GET_USER, binds);
  }
}

module.exports = new Database();
