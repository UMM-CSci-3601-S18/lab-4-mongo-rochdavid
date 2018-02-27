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
        page.typeACategory('t');
        expect(page.getUniqueTodo('Incididunt enim ea sit qui esse magna eu. Nisi sunt exercitation est Lorem consectetur incididunt cupidatat laboris commodo veniam do ut sint.')).toEqual('Blanche');
        page.backspace();
        page.typeACategory('h');
        expect(page.getUniqueTodo('Veniam ut ex sit voluptate Lorem. Laboris ipsum nulla proident aute culpa esse aute pariatur velit deserunt deserunt cillum officia dolore.')).toEqual('Fry');
    });
    it('should type something in filter body box and check that it returned correct element', () => {
        page.navigateTo();
        page.typeABody('sunt');
        expect(page.getUniqueTodo('Incididunt enim ea sit qui esse magna eu. Nisi sunt exercitation est Lorem consectetur incididunt cupidatat laboris commodo veniam do ut sint.')).toEqual('Blanche');
    });
    it('Should open the expansion panel and get the body', () => {
        page.navigateTo();
        page.getBody('Ullamco irure laborum magna dolor non. Anim occaecat adipisicing cillum eu magna in.');

        expect(page.getUniqueTodo('Ullamco irure laborum magna dolor non. Anim occaecat adipisicing cillum eu magna in.')).toEqual('Fry');

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
        expect(page.getUniqueTodo('In sunt ex non tempor cillum commodo amet incididunt anim qui commodo quis. Cillum non labore ex sint esse.')).toEqual('Blanche');
        expect(page.getUniqueTodo('Aliqua esse aliqua veniam id nisi ea. Ullamco Lorem ex aliqua aliquip cupidatat incididunt reprehenderit voluptate ad nisi elit dolore laboris.')).toEqual('Blanche');
        expect(page.getUniqueTodo('Incididunt Lorem magna velit laborum enim. Eu nisi laboris aliquip magna eu pariatur occaecat occaecat amet consectetur officia ad amet minim.')).toEqual('Blanche');
        expect(page.getUniqueTodo('Ullamco quis id exercitation qui aliquip dolor mollit pariatur veniam nisi consectetur ullamco. Lorem cillum sint fugiat enim consequat veniam laboris eiusmod.')).toEqual('Blanche');
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
});

