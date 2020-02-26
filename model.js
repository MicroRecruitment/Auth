var db = require('./integration.js');

class Result {
  constructor(status, result) {
    this.status = status;
    this.result = result;
  }
}

class Model {
  async ProcessResult(result) {
    let ret = new Result(false, []);
    if ('error' in result) {
    } else {
      ret.status = true;
      ret.result = result;
    }
    return ret;
  }
  /*
	* Register user.
  * @queue: auth_queue
	* @author: Linus Berg
	* @param {obj} Registration data.
	* @return {obj} Queue Reply Status.
	*/
  async Register(registration_data) {
    registration_data.role_id = 0;
    let result = await db.AddUser(registration_data);
    return await this.ProcessResult(result);
  }

  /*
	* Authenticate user.
  * @queue: auth_queue
	* @author: Linus Berg
	* @param {obj} Login data.
	* @return {obj} Queue Reply Status.
	*/
  async Login(login_data) {
    let result = await db.GetUserWithPassword(login_data);
    result = await this.ProcessResult(result);
    result.result = result.result[0];
    return result;
  }

  /*
	* Get user by username.
  * @queue: auth_queue
	* @author: Linus Berg
	* @param {string} Username.
	* @return {obj} Queue Reply Status.
	*/
  async GetUser(username) {
    let result = await db.GetUser(username);
    let ret = new Result(false, []);

    if (result.length <= 0) {
      ret.result = null;
    } else {
      ret.status = true;
      ret.result = result[0];
    }
    return ret;
  }
}
module.exports = Model;
