const amqp = require('amqplib');
const HOST = 'amqp://szjbyoed:GzlJdcWQTZ7HTtmKBVknLDoTGWUIBWTw@hawk.rmq.cloudamqp.com/szjbyoed';

class AMQP {
  constructor(req_queue, processor) {
    this.send_ = null;
    if (!(req_queue == '' || req_queue == null)) {
      this.consume_queue_ = req_queue;
    }
    this.cb_ = processor;
    
    this.ready_ = new Promise(function(resolve, reject) {
      this.open = amqp.connect(HOST);
      this.open.then(this.Setup.bind(this))
               .then(() => resolve(true))
               .catch(err => {
                 console.error('Could not connect to RabbitMQ');
                 console.error(err);
                 process.exit();
               });
    }.bind(this)); 
  }

  async Setup(conn) {
    let ch = await conn.createChannel();
    this.Consumer(ch);
    this.send_ = await conn.createChannel();
  }

  async Send(queue, metadata, data) {
    /* If a request has been made, loop until these are set. */
    await this.ready_;
    metadata.reply = this.consume_queue_; 
    
    var frame = {
      metadata: metadata,
      content: data
    };
    this.send_.sendToQueue(queue, Buffer.from(JSON.stringify(frame)));
    return true;
  }

  async Consumer(ch) {
    /* Requested queue name. Create if not exists, if null random consumption */
    ch.assertQueue(this.consume_queue_).then((function (q) {
      this.consume_queue_ = q.queue;
      /* Start consuming */
      console.log(q);
      ch.consume(q.queue, _process, {
        noAck: false
      });
    }).bind(this)).catch(err => {
      console.error('Could not create Consumer Queue');
      console.error(err);
      process.exit();
    });
    
    var that = this;
    function _process(msg) {
      that.cb_(JSON.parse(msg.content.toString()));
      ch.ack(msg);
    }
  }
}

module.exports = AMQP;
