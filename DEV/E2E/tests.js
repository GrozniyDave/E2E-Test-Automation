const addContext = require('mochawesome/addContext');
const {
    describe,
    after,
    before,
    it
} = require('mocha');
require('chai');
require('chai-as-promised');
let App;
///////Declared variables below//////


//chai methods in case I(you) will need them in testing
let expect = require('chai').expect;
let assert = require('chai').assert;
let should = require('chai').should();


//this variable sets delay between test actions
let testIntervalLong = 1300;
let testIntervalMiddle = 800;


///////////////////////////////////////////////////////////////////////
/////////////////////Test that were in file////////////////////////////
///////////////////////////////////////////////////////////////////////
describe('TEST THE WINDOW', function () {
    const ApplicationController = require('../bootstrap');

    after(async () => {
        try {
            await App.sleep(2000);
            await App.stop();
        } catch (e) {}
    });
    before(async () => {
        App = new ApplicationController();
        await App.start();
        //this is time before start tests
        await App.sleep(2000);
    });

    it("A window with the 'User Management' title is visible and focused", async function () {
        await App.sleep(1000);
        return App.client
            .waitUntilWindowLoaded()
            .getTitle()
            .should.eventually.equal('User Management');
    });

    it("Check the color of the 'Like' button on the first entry", async function () {
        await App.sleep(100);
        let elem = await App.client.element(
            '#table > tbody > tr:nth-child(1) > td:nth-child(6) > a.like'
        );
        App.client
            .elementIdCssProperty(elem.value.ELEMENT, 'color')
            .should.eventually.equal('rgba(0, 123, 255, 1)');
    });

    it("Click the 'Like' button on the second entry", async function () {
        await App.sleep(100);
        App.client
            .element('#table > tbody > tr:nth-child(2) > td:nth-child(6) > a.like')
            .click();
    });

    it("Check the color of the 'Like' button on the first entry", async function () {
        await App.sleep(100);
        let elem = await App.client.element(
            '#table > tbody > tr:nth-child(1) > td:nth-child(6) > a.like'
        );
        App.client
            .elementIdCssProperty(elem.value.ELEMENT, 'color')
            .should.eventually.equal('rgba(0, 123, 255, 1)');
    });

    it("Check if the 'Like' button on the second entry has the class 'liked'", async function () {
        await App.sleep(100);
        App.client
            .element('#table > tbody > tr:nth-child(2) > td:nth-child(6) > a.like')
            .getAttribute('class')
            .should.eventually.match('liked');

        addContext(this, {
            title: 'Classes on the button',
            value: {
                classes: await App.client
                    .element(
                        '#table > tbody > tr:nth-child(2) > td:nth-child(6) > a.like'
                    )
                    .getAttribute('class')
            }
        });
    });
    /////////////////////////////////////////////////////////////////////
    ////////////////////checking "Total" rows on page////////////////////
    /////////////////////////////////////////////////////////////////////
    describe('First check if app displays 10 rows per page as a standard', function () {
        it('Check if there are 10 rows per page', async function () {
            await App.sleep(testIntervalLong);
            let total = await App.client.element('body > div.bootstrap-table.bootstrap4 > div.fixed-table-container.fixed-height.has-footer > div.fixed-table-footer > table > thead > tr > th:nth-child(4) > div.th-inner').getAttribute('innerHTML')
            assert.equal(total, 10, "if it is equal to 10");
        });
    })


    /////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////localisation///////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////////
    describe('Localisation testing', async function () {
        //check if placeholder is in en/US language as standard
        it('if search has placeholder "Search"', async function () {
            await App.sleep(testIntervalMiddle);
            let placeholder = await App.client
                .element(
                    'body > div.bootstrap-table.bootstrap4 > div.fixed-table-toolbar > div.float-right.search.btn-group > input'
                )
                .getAttribute('placeholder');
            assert.equal(placeholder, 'Search', "if it is equal to 'Search'");
        });
        //click on localisation input to show dropdown
        it('click on "choose language"', async function () {
            await App.sleep(testIntervalMiddle);
            App.client
                .element(
                    '#locale'
                )
                .click();
        });
        //choose RU language from dropdown
        it('click on "RU language"', async function () {
            await App.sleep(testIntervalMiddle);
            App.client
                .element(
                    '#locale > option:nth-child(37)'
                )
                .click();
        });
        //if placeholder is in RU language
        it('if search has placeholder "Поиск" in RU language', async function () {
            await App.sleep(testIntervalMiddle);
            let placeholder = await App.client
                .element(
                    'body > div.bootstrap-table.bootstrap4 > div.fixed-table-toolbar > div.float-right.search.btn-group > input'
                )
                .getAttribute('placeholder');
            assert.equal(placeholder, 'Поиск', "if it is equal to 'Поиск'");
        });
        //choose en/US language to set to standard
        it('click on "en/US language to go back to standard language"', async function () {
            await App.sleep(testIntervalMiddle);
            App.client
                .element(
                    '#locale > option:nth-child(8)'
                )
                .click();
        });

    })


    /////////////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////Pagination/////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////////////////////
    describe('Pagination testing', function () {

        it('click on 2nd page', async function () {
            await App.sleep(testIntervalLong);
            App.client
                .element(
                    'body > div.bootstrap-table.bootstrap4 > div.fixed-table-pagination > div.float-right.pagination > ul > li:nth-child(3) > a'
                )
                .click();

        });
        it('check if first entry has id = 10', async function () {
            await App.sleep(testIntervalMiddle);
            let firstID = await App.client
                .element(
                    '#table > tbody > tr:nth-child(1) > td:nth-child(3)'
                )
                .getAttribute('innerHTML');
            assert.equal(firstID, '10', "if it is equal to 10?");
        });
        it('click on 5nd page', async function () {
            await App.sleep(testIntervalLong);
            App.client
                .element(
                    'body > div.bootstrap-table.bootstrap4 > div.fixed-table-pagination > div.float-right.pagination > ul > li:nth-child(6) > a'
                )
                .click();

        });
        it('check if first entry has ID = 40', async function () {
            await App.sleep(testIntervalMiddle);
            let firstID = await App.client
                .element(
                    '#table > tbody > tr:nth-child(1) > td:nth-child(3)'
                )
                .getAttribute('innerHTML');
            assert.equal(firstID, '40', "if it is equal to 40?");
        });
    })


    /////////////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////total entries per page/////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////////////////////
    describe('How many entries per page functionality', function () {
        it('clicks on pagination dropdown', async function () {
            await App.sleep(testIntervalLong);
            App.client
                .element(
                    'body > div.bootstrap-table.bootstrap4 > div.fixed-table-pagination > div.float-left.pagination-detail > span.page-list > span > button'
                )
                .click();
        });
        it('clicks on "25" (2nd option) from dropdown', async function () {
            await App.sleep(testIntervalMiddle);
            App.client
                .element(
                    'body > div.bootstrap-table.bootstrap4 > div.fixed-table-pagination > div.float-left.pagination-detail > span.page-list > span > div > a:nth-child(2)'
                )
                .click();
        });
        // if row count is = 25 after choosing 25 entries per page
        it('Check if there are 25 entries', async function () {
            await App.sleep(testIntervalLong);
            let rowCount = await App.client.element('#table > tbody').getAttribute('childElementCount')
            assert.equal(rowCount, '25', "if it is equal to 25?");
        });

    })


    ///////////////////////////////////////////////////////////////////
    ////////////////////How many windows are opened////////////////////
    ///////////////////////////////////////////////////////////////////
    describe('Opened window count', function () {
        // Check if window count is 1
        it('should check if the window count is 1', function () {
            return App.client
                .waitUntilWindowLoaded()
                .getWindowCount()
                .should.eventually.equal(1);
        });
    });


    ////////////////////////////////////////////////////////////
    ////////////////////search manipulations////////////////////
    ////////////////////////////////////////////////////////////
    describe('Search manipulations', function () {
        it("Search for any entry which contains value '160'", async function () {
            await App.sleep(testIntervalLong);
            //click on search box
            App.client
                .element(
                    'body > div.bootstrap-table.bootstrap4 > div.fixed-table-toolbar > div.float-right.search.btn-group > input'
                )
                .click();
            //type in search box '160'
            App.client
                .element(
                    'body > div.bootstrap-table.bootstrap4 > div.fixed-table-toolbar > div.float-right.search.btn-group > input'
                )
                .addValue('160');
        });
        it('Click on the entry from the search result', async function () {
            await App.sleep(testIntervalLong);
            //click on searched entry result
            App.client
                .element(
                    '#table > tbody > tr > td.bs-checkbox > label > input[type=checkbox]'
                )
                .click();
        });
        it('Click on the delete button', async function () {
            await App.sleep(testIntervalLong);
            //click on "Delete" button
            App.client.element('#remove').click();
        });
        it('Remove the search input text', async function () {
            await App.sleep(testIntervalLong);
            //delete everything from search box
            App.client
                .element(
                    'body > div.bootstrap-table.bootstrap4 > div.fixed-table-toolbar > div.float-right.search.btn-group > input'
                )
                .setValue('');
        });
        //check if there are NO results after the search
        it('Check if any items are present after the search', async function () {
            await App.sleep(testIntervalLong);
            let total = await App.client.element('body > div.bootstrap-table.bootstrap4 > div.fixed-table-container.fixed-height.has-footer > div.fixed-table-footer > table > thead > tr > th:nth-child(4) > div.th-inner').getAttribute('innerHTML')
            assert.equal(total, 25, "if it is equal to 10");
        });
    });


    ///////////////////////////////////////////////////////////////////////
    ////////////////////checking 5 rows and delete them////////////////////
    //////////////////then check if there are 5 rows left//////////////////
    ///////////////////////////////////////////////////////////////////////
    describe('Deleting 5 rows', function () {
        it('Check the first 5 rows', async function () {
            await App.sleep(testIntervalLong);
            //click on first 5 elements
            App.client
                .element(
                    '#table > tbody > tr:nth-child(1) > td.bs-checkbox > label > input[type=checkbox]'
                )
                .click();
            App.client
                .element(
                    '#table > tbody > tr:nth-child(2) > td.bs-checkbox > label > input[type=checkbox]'
                )
                .click();
            App.client
                .element(
                    '#table > tbody > tr:nth-child(3) > td.bs-checkbox > label > input[type=checkbox]'
                )
                .click();
            App.client
                .element(
                    '#table > tbody > tr:nth-child(4) > td.bs-checkbox > label > input[type=checkbox]'
                )
                .click();
            App.client
                .element(
                    '#table > tbody > tr:nth-child(5) > td.bs-checkbox > label > input[type=checkbox]'
                )
                .click();
        });
        //deleting 5 first rows
        it('Delete the first 5 rows', async function () {
            await App.sleep(testIntervalLong);
            //click on delete button
            App.client.element('#remove').click();
        });
        // if row count is = 5 after deleting 5
        it('Check if there are 25-5=20 rows left?', async function () {
            await App.sleep(testIntervalLong);
            let rowCount = await App.client.element('#table > tbody').getAttribute('childElementCount')
            assert.equal(rowCount, '20', "if it is equal to 20?");
        });
    });


    ////////////////////////////////////////////////////////////
    ////////////////////hide/show ID////////////////////////////
    ////////////////////////////////////////////////////////////
    //hide ID field
    describe('Hide ID field', function () {
        //click on menu icon to show dropdown
        it('click on the display controller', async function () {
            await App.sleep(testIntervalLong);
            App.client
                .element(
                    'body > div.bootstrap-table.bootstrap4 > div.fixed-table-toolbar > div.columns.columns-right.btn-group.float-right > div.keep-open.btn-group > button'
                )
                .click();
        });
        //click on id filter section
        it('click on ID section to disable ID field', async function () {
            await App.sleep(testIntervalLong);
            App.client
                .element(
                    'body > div.bootstrap-table.bootstrap4 > div.fixed-table-toolbar > div.columns.columns-right.btn-group.float-right > div.keep-open.btn-group.show > div > label:nth-child(3) > input[type=checkbox]'
                )
                .click();
        });

        //click again on menu icon to hide dropdown
        it('click again on the display controller to hide it', async function () {
            await App.sleep(testIntervalLong);
            App.client
                .element(
                    'body > div.bootstrap-table.bootstrap4 > div.fixed-table-toolbar > div.columns.columns-right.btn-group.float-right > div.keep-open.btn-group > button'
                )
                .click();
        });

        ////////////show ID field////////////

        //click on menu icon to show dropdown
        it('click on the display controller', async function () {
            await App.sleep(testIntervalLong);
            App.client
                .element(
                    'body > div.bootstrap-table.bootstrap4 > div.fixed-table-toolbar > div.columns.columns-right.btn-group.float-right > div.keep-open.btn-group > button'
                )
                .click();
        });
        //click on id filter section
        it('click on ID section to enable ID field', async function () {
            await App.sleep(testIntervalLong);
            App.client
                .element(
                    'body > div.bootstrap-table.bootstrap4 > div.fixed-table-toolbar > div.columns.columns-right.btn-group.float-right > div.keep-open.btn-group.show > div > label:nth-child(3) > input[type=checkbox]'
                )
                .click();
        });

        //click on menu icon to hide dropdown
        it('click again on the display controller to hide it', async function () {
            await App.sleep(testIntervalLong);
            App.client
                .element(
                    'body > div.bootstrap-table.bootstrap4 > div.fixed-table-toolbar > div.columns.columns-right.btn-group.float-right > div.keep-open.btn-group > button'
                )
                .click();
        });
    });


    //////////////////////////////////////////////////////////////////////
    ////////////////////sort table by username////////////////////////////
    //////////////////////////////////////////////////////////////////////
    //sort by username
    describe('Sort by Username', function () {
        it("Click on 'Username'", async function () {
            await App.sleep(testIntervalLong);
            App.client
                .element(
                    'body > div.bootstrap-table.bootstrap4 > div.fixed-table-container.fixed-height.has-footer > div.fixed-table-header > table > thead > tr:nth-child(2) > th:nth-child(1) > div.th-inner.sortable.both')
                .click();
        });
        //sort by username 2nd time click
        it("Click on 'Username' once more", async function () {
            await App.sleep(testIntervalLong);
            App.client
                .element(
                    'body > div.bootstrap-table.bootstrap4 > div.fixed-table-container.fixed-height.has-footer > div.fixed-table-header > table > thead > tr:nth-child(2) > th:nth-child(1) > div.th-inner.sortable.both.asc')
                .click();
        });
    });
});