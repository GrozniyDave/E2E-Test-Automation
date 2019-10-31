const {
    Application
} = require('spectron');
const electronPath = require('electron');
const path = require('path');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const addContext = require('mochawesome/addContext');

process.setMaxListeners(200);

class ApplicationController {
    // app;

    async start(args) {
        this.app = new Application({
            path: electronPath,
            args: [path.join(__dirname, '../'), args ? args : ''],
            webdriverOptions: {},
            chromeDriverArgs: ['--disable-extensions'],
            env: {
                SPECTRON: true,
                ELECTRON_ENABLE_LOGGING: true,
                ELECTRON_ENABLE_STACK_DUMPING: true,
            },
        });

        chai.should();
        chai.use(chaiAsPromised);
        chaiAsPromised.transferPromiseness = this.app.transferPromiseness;

        await this.app.start();
        this.browser = this.app.client;
        await this.browser.waitUntilWindowLoaded(4500);
    }
    async stop() {
        if (this.app && this.app.isRunning()) {
            return this.app.stop();
        }
        return null;
    }

    get client() {
        return this.app.client;
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

module.exports = ApplicationController;