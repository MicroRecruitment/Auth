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

    var db_data = {
      name: registration_data.name,
      surname: registration_data.surname,
      ssn: registration_data.ssn,
      email: registration_data.email,
      username: registration_data.username,
      password: registration_data.password,
      role_id: 1
    }
    var result = await db.AddUser(db_data);
    
    var ret = new ReturnObj(false, []);

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
    var result = await db.GetUser(login_data);
    var ret = new ReturnObj(false, []);

    if (result.length <= 0) {
      console.log('--- DB/Login Failed ---');
      console.log(result);
    } else {
      console.log('Login Success');
      ret.status = true;
      ret.result = result;
    }
    return ret;
  }
}
module.exports = Model
