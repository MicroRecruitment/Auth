var db = require('./integration.js');

class ReturnObj {
  constructor(status, result) {
    this.status = status;
    this.result = result;
  }
}

class Model {
  async Register(registration_data) {
    console.log('Auth (Model)');
    console.log(registration_data);

    let db_data = {
      name: registration_data.name,
      surname: registration_data.surname,
      ssn: registration_data.ssn,
      email: registration_data.email,
      username: registration_data.username,
      password: registration_data.password,
      role_id: 1
    }
    let result = await db.AddUser(db_data);
    
    let ret = new ReturnObj(false, []);

    if ('error' in result) {
      console.log('--- DB Failed ---');
      console.log(result);
    } else {
      console.log('DB Success');
      ret.status = true;
      ret.result = result;
    }
    return ret;
  }

  async Login(login_data) {
    let result = await db.GetUserWithPassword(login_data);
    let ret = new ReturnObj(false, []);

    if (result.length <= 0) {
      ret.result = null;
    } else {
      ret.status = true;
    }
    console.log(result[0]);
    ret.result = result[0];
    return ret;
  }
  
  async UserExists(username) {
    let result = await db.GetUser(username);
    let ret = new ReturnObj(false, []);

    if (result.length <= 0) {
      ret.result = null;
    } else {
      ret.status = true;
    }
    console.log(result[0]);
    ret.result = result[0];
    return ret;
  }
}
module.exports = Model
