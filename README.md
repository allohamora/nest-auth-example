# Nest Auth Example
[nest](https://github.com/nestjs/nest) authentication and authorization example. 

## Used technologies
* [nest](https://github.com/nestjs/nest)
* [typeorm](https://github.com/typeorm/typeorm)
* [swagger](https://swagger.io) as [@nestjs/swagger](https://docs.nestjs.com/openapi/introduction)
* [passport](https://github.com/jaredhanson/passport)
* [casl](https://github.com/stalniy/casl)

## Docs
* run the app
* open /api
* enjoy swagger docs

## Installation

```bash
$ npm install
```

## Running the app

```bash
# develoment
# create and fill .env from .env.example
$ docker-compose up
$ npm run start:dev
```

## Test

```bash
# unit tests
$ npm run test

# test coverage
$ npm run test:cov
```

## Other variants
- [auth0](https://github.com/Allohamora/experiments/tree/master/topics/auth0)
- [without passport](https://github.com/Allohamora/nest-auth-example/tree/guard)
