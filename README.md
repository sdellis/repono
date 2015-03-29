![manifesto icon](public/img/manifesto.png?raw=true) Manifesto
=============================================================================

Manifesto is a RESTful API for creating and editing [IIIF Presentation Manifests](http://iiif.io/api/presentation/2.0/). It is a simple datastore that can be used for test data (and potentially more).  Since client-side "testing" is one of the use cases, Manifesto must be able to store invalid manifests that clients respond to.  Therefore no validation is performed and is left up to the clients.

Note: If a manifest contains an @id property, the server will use the post-prefix id string as MongoDB's internal _id value.  Otherwise, one will be generated.

##Brief instructions:

```
$ git clone https://github.com/sdellis/manifesto.git
$ cd manifesto
$ npm install
$ npm start
```

##Tests
Running tests will create a "manifests" collection, which is needed for the server to work. To run tests, in a new terminal window:

```
$ mocha express.test.js
```

Or, if you don't have mocha installed globally:

```
$ ./node_modules/mocha/bin/mocha express.test.js
```

##Use Your DB
You can add your own db to the app by editing the 'test' part in the following line in express.js:
```
var db = mongoskin.db('mongodb://@localhost:27017/YourDBName', {safe:true})
```

##Add Manifests
Go to [localhost:3000](http://localhost:3000) and start doing CRUD to manifests.

You can also use CURL to do CRUD to your own collections and manifests.

```
$ curl -H "Content-Type: application/json" -X GET http://localhost:3000/collections/manifests/
$ curl -H "Content-Type: application/json" -X GET http://localhost:3000/collections/manifests/:id
$ curl -H "Content-Type: application/json" -X DELETE http://localhost:3000/collections/manifests/:id
$ curl -H "Content-Type: application/json" -X PUT -d '{"label":"Thus Spoke Zarathustra"}' http://localhost:3000/collections/manifests/:id
$ curl -H "Content-Type: application/json" -X POST -d '{"label":"Thus Spoke Zarathustra"}' http://localhost:3000/collections/manifests/
```

You can also create your own collections by simply posting to a new collection name (soon to be integrated with the web interface):
```
$ curl -H "Content-Type: application/json" -X POST -d '{"label":"Thus Spoke Zarathustra"}' http://localhost:3000/collections/MyNewCollection
```

> Attribution: This work is based on Azat Mardan's [REST-API-EXPRESS repository](https://github.com/azat-co/rest-api-express) for Express 4.
