# Introduction ##
#### WordPress.com REST API Utilities

The missing functionalities based on [WordPress.com REST API](https://developer.wordpress.com/docs/)


## Installation ##
* Install [Node.js >= v4.x.x and npm](http://nodejs.org/)
* Install all node package dependencies:
```bash
$ npm install
```
And that's it, all setup is done.

## Usage ##

* Update to your own WordPress.com user account credential in config/default.json
* Run the following command:
```bash
$ npm run purge_posts
```

You can also choose to pass in your user credential from command line
through environment variable `NODE_CONFIG` (no config/default.json update is needed this way):
```bash
$ NODE_CONFIG='{"user":{"name": "yourusername", "password": "yourpassword"}}' npm run purge_posts
```

Note: Only `purge_posts` is supported for now, more functionalities will
come based on requirements, or feel free to extend.

## License
Licensed under the [MIT](http://opensource.org/licenses/MIT)
