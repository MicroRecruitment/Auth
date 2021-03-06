'use strict';
const rmq = require('./MQ/AMQP.js');
const model = require('./model.js');
const ENV = require('./env.json');

const AUTH_QUEUE = ENV.queues.AUTH_QUEUE;

class Controller {
  constructor() {
    var that = this;
    this.logic_ = new model();
    this.fnc_ = {
      /*
       * INPUT
       * frame.ssn
       * frame.name
       * frame.surname
       * frame.email
       * frame.username
       * frame.password
       */
      register: async function(frame) {
        return that.logic_.Register(frame.content);
      },
      /*
       * INPUT
       * frame.username - username of user to get
       * frame.password - password of user to get
       */
      login: async function(frame) {
        return that.logic_.Login(frame.content);
      },
      /*
       * INPUT
       * frame.username - username of user to get
       */
      get_user: async function(frame) {
        return that.logic_.GetUser(frame.content);
      },
    };
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
    console.log('API Gateway Sent:', recv_frame);
    /* Metadata */
    const fnc = recv_frame.metadata.call;
    const call_id = recv_frame.metadata.call_id;
    const reply_queue = recv_frame.metadata.reply;

    if (!this.fnc_[fnc]) {
      console.log('Error: Cannot handle function "' + fnc + '"');
      return;
    }
    this.fnc_[fnc](recv_frame)
      .then(function(result) {
        var metadata = {
          /* Call id */
          call_id: call_id,
        };

        var content = {
          status: result.status,
          result: result.result,
        };

        that.mq_.Send(reply_queue, metadata, content);
      })
      .catch(e => {
        console.log(e);
      });
  }
}

module.exports = Controller;
