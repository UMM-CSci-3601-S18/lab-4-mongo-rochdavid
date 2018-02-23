import {ComponentFixture, TestBed, async} from '@angular/core/testing';
import {Todo} from './todo';
import {TodoListComponent} from './todo-list.component';
import {TodoListService} from './todo-list.service';
import {Observable} from 'rxjs/Observable';
import {FormsModule} from '@angular/forms';
import {CustomModule} from '../custom.module';
import {MATERIAL_COMPATIBILITY_MODE} from '@angular/material';
import {MatDialog} from '@angular/material';

import 'rxjs/add/observable/of';
import 'rxjs/add/operator/do';

describe('Todo list', () => {

    let todoList: TodoListComponent;
    let fixture: ComponentFixture<TodoListComponent>;

    let todoListServiceStub: {
        getTodos: () => Observable<Todo[]>
    };

    beforeEach(() => {
        // stub TodoService for test purposes
        todoListServiceStub = {
            getTodos: () => Observable.of([
                {
                    _id: 'jamie_id',
                    owner: 'Adam',
                    status: true,
                    body: 'Frogs, Inc.',
                    category: 'jamie@frogs.com'
                },
                {
                    _id: 'jamie_id',
                    owner: 'Brad',
                    status: true,
                    body: 'Frogs, Inc.',
                    category: 'jamie@frogs.com'
                },
                {
                    _id: 'jamie_id',
                    owner: 'Chuck',
                    status: false,
                    body: 'Frogs, Inc.',
                    category: 'jamie@frogs.com'

                },
                {
                    _id: 'jamie_id',
                    owner: 'Chuck',
                    status: true,
                    body: 'Frogs, Inc.',
                    category: 'jamie@frogs.com'

                }
            ])
        };

        TestBed.configureTestingModule({
            imports: [CustomModule],
            declarations: [TodoListComponent],
            // providers:    [ TodoListService ]  // NO! Don't provide the real service!
            // Provide a test-double instead
            providers: [{provide: TodoListService, useValue: todoListServiceStub},
                {provide: MATERIAL_COMPATIBILITY_MODE, useValue: true}]
        });
    });

    beforeEach(async(() => {
        TestBed.compileComponents().then(() => {
            fixture = TestBed.createComponent(TodoListComponent);
            todoList = fixture.componentInstance;
            fixture.detectChanges();
        });
    }));

    it('contains all the todos', () => {
        expect(todoList.todos.length).toBe(4);
    });

    it('contains a todo with owner \'Adam\'', () => {
        expect(todoList.todos.some((todo: Todo) => todo.owner === 'Adam')).toBe(true);
    });

    it('contain a todo with owner \'Brad\'', () => {
        expect(todoList.todos.some((todo: Todo) => todo.owner === 'Brad')).toBe(true);
    });

    it('doesn\'t contain a todo with owner \'Santa\'', () => {
        expect(todoList.todos.some((todo: Todo) => todo.owner === 'Santa')).toBe(false);
    });

    it('has two todos with owner Chuck', () => {
        expect(todoList.todos.filter((todo: Todo) => todo.owner === 'Chuck').length).toBe(2);
    });

    it('todo list filters by owner', () => {
        expect(todoList.filteredTodos.length).toBe(4);
        todoList.todoOwner = 'a';
        todoList.refreshTodos().subscribe(() => {
            expect(todoList.filteredTodos.length).toBe(2);
        });
    });
});

describe('Misbehaving Todo List', () => {
    let todoList: TodoListComponent;
    let fixture: ComponentFixture<TodoListComponent>;

    let todoListServiceStub: {
        getTodos: () => Observable<Todo[]>
    };

    beforeEach(() => {
        // stub TodoService for test purposes
        todoListServiceStub = {
            getTodos: () => Observable.create(observer => {
                observer.error('Error-prone observable');
            })
        };

        TestBed.configureTestingModule({
            imports: [FormsModule, CustomModule],
            declarations: [TodoListComponent],
            providers: [{provide: TodoListService, useValue: todoListServiceStub},
                {provide: MATERIAL_COMPATIBILITY_MODE, useValue: true}]
        });
    });

    beforeEach(async(() => {
        TestBed.compileComponents().then(() => {
            fixture = TestBed.createComponent(TodoListComponent);
            todoList = fixture.componentInstance;
            fixture.detectChanges();
        });
    }));

    it('generates an error if we don\'t set up a TodoListService', () => {
        // Since the observer throws an error, we don't expect todos to be defined.
        expect(todoList.todos).toBeUndefined();
    });
});
