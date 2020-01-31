var db = require('./integration.js');

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
    
    var ret = {
      status: false,
      result: []
    }

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
}
module.exports = Model
