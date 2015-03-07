# <%= name %> Seneca micro-service

<%= description %>

This is a sample [Seneca](http://senecajs.org/) micro-service, generated with
[generator-seneca-micro](https://github.com/laurisvan/generator-seneca-micro) Yeoman generator.

## Running

Start the server by running `npm start`. If you already created micro-services
(using the default) HTTP transport, you can test them through your browser as follows:

    > curl -d '{ "foo": "bar" }' http://localhost:10101/fooService

### Running with Docker

The generator comes with support with a minimal node.js Docker image. To build and run
the container, run:

    > docker build -t <%= name.toLowerCase() %> .  # to build the Docker image with name "<%= name.toLowerCase() %>"
    > docker run -d -P <%= name.toLowerCase() %>   # to start it
