<p align="center">
    <img alt="XPloria" src="https://images.mmorpg.com/images/mmorpg_logo.png" width="400"/>
</p>

# XPloria


A server for XPloria, an MMORG (Massive Multiplayer Online Role-Playing Game).
Written in Node.JS, Socket.io and TypeScript.
Covered with End to End automations, using Protractor.

## Getting Started

Run the following to bootstrap the app and begin typescript watch:
```
gulp
```

## Tests

The tests package is isolated and located inside the /tests folder.
The target of the tests is to run locally before committing changes and to be a sanity indicator that everything is ok.
Tests are written in Protractor with Karma and cover the server from end to end.

### Run the tests once
To just perform the tests once, we simply run:
```
npm test
```

### Develop tests
If we want to add tests, we use the following steps - 

First, we make sure we have the app up and running:
```
gulp
```
The first time we run the tests, we have to install the npm dependencies:
```
cd tests
npm i
```
We run the following to get the testing server up and to begin the typescript watch:
```
cd tests
npm start
```
Now to begin tests, we open another tab and run:
```
cd tests
npm test
```

## Contributing

In order to contribute, open an [issue](https://github.com/Tzook/lul/issues/new) with a feature request / bug report.

## Bug Reporting

Any bug reported will be gladly accepted. Open an [issue](https://github.com/Tzook/lul/issues/new) and be as specific as possible, preferably with a screenshot.


## Authors

* **Tzook Shaked** - *Everything* - [Tzook](https://github.com/Tzook)
* **Ben Rokah** - *Client side* - [Ben](https://github.com/Benk0913)

See also the list of [contributors](https://github.com/Tzook/lul/contributors) who participated in this project.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.
