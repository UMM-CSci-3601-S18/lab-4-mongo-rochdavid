import {TodoPage} from './todo-list.po';
import {browser, protractor, element, by} from 'protractor';
import {Key} from 'selenium-webdriver';

const origFn = browser.driver.controlFlow().execute;

// https://hassantariqblog.wordpress.com/2015/11/09/reduce-speed-of-angular-e2e-protractor-tests/
// browser.driver.controlFlow().execute = function () {
//     let args = arguments;
//
//     // queue 100ms wait between test
//     // This delay is only put here so that you can watch the browser do its thing.
//     // If you're tired of it taking long you can remove this call
//     origFn.call(browser.driver.controlFlow(), function () {
//         return protractor.promise.delayed(100);
//     });
//
//     return origFn.apply(browser.driver.controlFlow(), args);
// };

describe('Todo list', () => {
    let page: TodoPage;

    beforeEach(() => {
        page = new TodoPage();
    });

    it('should get and highlight Todos title attribute ', () => {
        page.navigateTo();
        expect(page.getTodoTitle()).toEqual('Todos');
    });

    it('should type something in filter category box and check that it returned correct element', () => {
        page.navigateTo();
        page.typeACategory('sof');
        expect(page.getUniqueTodo('58af3a600343927e48e87212')).toEqual('Blanche');
        page.backspace();
        page.backspace();
        page.backspace();
        page.typeACategory('software');
        expect(page.getUniqueTodo('58af3a600343927e48e87212')).toEqual('Blanche');
    });
    it('should type something in filter body box and check that it returned correct element', () => {
        page.navigateTo();
        page.typeABody('sunt');
        expect(page.getUniqueTodo('58af3a600343927e48e87212')).toEqual('Blanche');
    });
    it('Should open the expansion panel and get the body', () => {
        page.navigateTo();
        page.getBody('Ullamco irure laborum magna dolor non. Anim occaecat adipisicing cillum eu magna in.');

        expect(page.getUniqueTodo('58af3a600343927e48e87211')).toEqual('Fry');

        // This is just to show that the panels can be opened
        browser.actions().sendKeys(Key.TAB).perform();
        browser.actions().sendKeys(Key.ENTER).perform();
    });

    it('Should allow us to filter todos based on owner', () => {
        page.navigateTo();
        page.getOwner('blanche');
        page.getTodos().then(function(todos) {
            expect(todos.length).toBe(10);
        });
        expect(page.getUniqueTodo('58af3a600343927e48e87213')).toEqual('Blanche');
        expect(page.getUniqueTodo('58af3a600343927e48e87216')).toEqual('Blanche');
        expect(page.getUniqueTodo('58af3a600343927e48e87212')).toEqual('Blanche');
        expect(page.getUniqueTodo('58af3a600343927e48e8720f')).toEqual('Blanche');
    });

    it('Should allow us to clear a search for owner and then still successfully search again', () => {
        page.navigateTo();
        page.getOwner('fry');
        page.getTodos().then(function(todos) {
            expect(todos.length).toBe(10);
        });
        page.clickClearOwnerSearch();
        page.getTodos().then(function(todos) {
            expect(todos.length).toBe(10);
        });
        page.getOwner('workman');
        page.getTodos().then(function(todos) {
            expect(todos.length).toBe(10);
        });
    });

    it('Should allow us to search for owner, update that search string, and then still successfully search', () => {
        page.navigateTo();
        page.getOwner('o');
        page.getTodos().then(function(todos) {
            expect(todos.length).toBe(10);
        });
    });

// For examples testing modal dialog related things, see:
// https://code.tutsplus.com/tutorials/getting-started-with-end-to-end-testing-in-angular-using-protractor--cms-29318
// https://github.com/blizzerand/angular-protractor-demo/tree/final

    it('Should have an add todo button', () => {
        page.navigateTo();
        expect(page.buttonExists()).toBeTruthy();
    });

    it('Should open a dialog box when add todo button is clicked', () => {
        page.navigateTo();
        expect(element(by.css('add-todo')).isPresent()).toBeFalsy('There should not be a modal window yet');
        element(by.id('addNewTodo')).click();
        expect(element(by.css('add-todo')).isPresent()).toBeTruthy('There should be a modal window now');
    });

    it('Should actually add the todo with the information we put in the fields', () => {
        page.navigateTo();
        page.clickAddTodoButton();
        element(by.id('ownerField')).sendKeys('Bilbo');
        element(by.id('categoryField')).sendKeys('video games');
        element(by.id('statusField')).sendKeys('True');
        element(by.id('confirmAddTodoButton')).click();
    });

    it('Should allow us to put information into the fields of the add todo dialog', () => {
        page.navigateTo();
        page.clickAddTodoButton();
        expect(element(by.id('ownerField')).isPresent()).toBeTruthy('There should be a owner field');
        element(by.id('ownerField')).sendKeys('Bilbo');
        expect(element(by.id('categoryField')).isPresent()).toBeTruthy('There should be a category field');
        element(by.id('categoryField')).sendKeys('video games');
        expect(element(by.id('statusField')).isPresent()).toBeTruthy('There should be an status field');
        element(by.id('statusField')).sendKeys('true');
        expect(element(by.id('bodyField')).isPresent()).toBeTruthy('There should be an body field');
        element(by.id('bodyField')).sendKeys('Sunt ipsum');
    });

    it('Should open a dropdown menu when status button is clicked', () => {
        page.navigateTo();
        element(by.id('todoStatus')).click();
        element(by.css('.mat-option[value="false"]')).click();
        expect(page.getUniqueTodo('58af3a600343927e48e87217')).toEqual('Fry');
        element(by.id('todoStatus')).click();
        element(by.css('.mat-option[value="true"]')).click();
        expect(page.getUniqueTodo('58af3a600343927e48e87213')).toEqual('Blanche');
        element(by.id('todoStatus')).click();
        element(by.css('.mat-option[value=""]')).click();
        expect(page.getUniqueTodo('58af3a600343927e48e87213')).toEqual('Blanche');
    });
    it('Get Todos with combination of fields, including owner and status', () => {
        page.navigateTo();
        element(by.id('todoStatus')).click();
        element(by.css('.mat-option[value="false"]')).click();
        page.typeACategory('sof');
        page.getOwner('Workman');
        expect(page.getUniqueTodo('58af3a600343927e48e87231')).toEqual('Workman');
    });
});

