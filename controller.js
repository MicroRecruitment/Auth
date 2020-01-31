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
      register: async function(frame) {
        console.log('Register controller fnc');
        return that.logic_.Register(frame.data.registration_data);
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
    this.fnc_[recv_frame.data.call](recv_frame).then(function(result) {
      var snd_frame = {
        status: result.status,
        result: result.result,
        /* Call id */
        call_id: recv_frame.data.call_id
      };

      that.mq_.Send(recv_frame.reply, snd_frame);
    }).catch(e => {
      console.log(e); 
    });

  }
}

module.exports = Controller;
