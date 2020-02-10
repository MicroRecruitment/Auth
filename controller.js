'use strict';
const rmq = require('./MQ/AMQP.js');
const model = require('./model.js');
const ENV = require('./env.json');

const AUTH_QUEUE = ENV.queues.AUTH_QUEUE

class Controller {
  constructor() {
    var that = this;
    this.logic_ = new model();
    this.fnc_ = {
      /* Register handler */
      register: async function(frame) {
        console.log('Register controller fnc');
        return that.logic_.Register(frame.content);
			},
      /* Login handler */
      login: async function(frame) {
        console.log('Login controller fnc');
        return that.logic_.Login(frame.content);
			},
      user_exists: async function(frame) {
        console.log('User exists controller fnc');
        return that.logic_.UserExists(frame.content);
      }
		}
   /*
    * Create new amqp connection with randomly generated
		* consumption queue.
    */
    this.mq_ = new rmq(AUTH_QUEUE, this.Process.bind(this));
  }

 /*
	* Processing function for queue messages.
	* @author: Linus Berg
	* @param {obj} Message object from RabbitMQ.
	*/
  Process(recv_frame) {
    var that = this;
    console.log('Auth (Controller MQ)');
    console.log(recv_frame);
    
    /* Metadata */
    const fnc = recv_frame.metadata.call;
    const call_id = recv_frame.metadata.call_id;
    const reply_queue = recv_frame.metadata.reply;
    
    this.fnc_[fnc](recv_frame).then(function(result) {
      var metadata = {
        /* Call id */
        call_id: call_id 
      };

      var content = {
        status: result.status,
        result: result.result
      }

      that.mq_.Send(reply_queue, metadata, content);
    }).catch(e => {
      console.log(e); 
    });
  }
}

module.exports = Controller;
