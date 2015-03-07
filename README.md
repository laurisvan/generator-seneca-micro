# Seneca Micro-service Generator [![Build Status](https://travis-ci.org/laurisvan/generator-seneca-micro.svg?branch=master)](http://travis-ci.org/laurisvan/generator-seneca-micro)

> Yeoman generator for [Seneca](http://senecajs.org/) node.js micro-services and -clients, with basic boilerplate and packaging.

## Usage

Install `generator-seneca-micro`:
```
npm install -g generator-seneca-micro
```

Make a new directory, and `cd` into it:
```
mkdir my-new-project && cd $_
```

Run `yo seneca-micro`,
```
yo seneca-micro         # To create a server + micro-services
yo seneca-micro:service # To create an extra micro-service
yo seneca-micro:client  # To create an extra micro-service
```

The generator will prompt you further information, such as package name, description and Docker usage.

## Generators
Available generators:
* service: Generates a micro-service Node.js module
* client: Generates a stub client for a micro-service

## Running

Both the server and client can be started by running `npm start`.

### Running with Docker

The generator comes with support with a minimal node.js Docker image. To build and run
the container, run:

    > docker build -t myserver . # to build the Docker image with name "myserver"
    > docker run -d -P myserver  # to start it

## License

[MIT license](http://opensource.org/licenses/MIT)