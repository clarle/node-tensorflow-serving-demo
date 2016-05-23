const grpc       = require('grpc');
const express    = require('express');
const bodyParser = require('body-parser');

// TensorFlow Serving configuration settings
const config = require('./config');

// Load Protocol Buffers
const proto = grpc.load('./protos/mnist_inference.proto').tensorflow.serving;
const MnistService = proto.MnistService;

// Create TensorFlow Serving MNIST client
const client = new MnistService(config.TENSORFLOW_SERVING_HOST, grpc.credentials.createInsecure());

// Express application initialization
const app  = express();
const port = process.env.PORT || config.PORT || 3000;

// Express middleware
app.use(bodyParser.json());

// Express routes
app.post('/classify', (req, res) => {
  // Snake-case only because the gRPC protocol requires it
  const image_data = req.body.image;
  client.classify({ image_data }, (err, mnistResponse) => {
    if (err) {
      // TODO: Implement actual error handler
      next(err);
    } else {
      const results = mnistResponse ? mnistResponse.value : [];
      const percentages = results.map((result) => Math.ceil(result * 10000) / 100);
      res.json({ percentages });
    }
  });
});

console.log(`App now listening on port ${port}...`);
app.listen(port);