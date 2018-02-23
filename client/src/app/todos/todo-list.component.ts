import {Component, OnInit} from '@angular/core';
import {TodoListService} from './todo-list.service';
import {Todo} from './todo';
import {Observable} from 'rxjs';
import {MatDialog} from '@angular/material';
import {AddTodoComponent} from './add-todo.component';

@Component({
    selector: 'todo-list-component',
    templateUrl: 'todo-list.component.html',
    styleUrls: ['./todo-list.component.css'],
})

export class TodoListComponent implements OnInit {
    // These are public so that tests can reference them (.spec.ts)
    public todos: Todo[];
    public filteredTodos: Todo[];

    // The ID of the
    private highlightedID: {'$oid': string} = { '$oid': '' };

    public todoCategory: string;
    public todoOwner: string;
    public todoBody: string;
    public todoStatus: boolean;
    public loadReady = false;

    // Inject the TodoListService into this component.
    // That's what happens in the following constructor.
    // panelOpenState: boolean = false;
    // We can call upon the service for interacting
    // with the server.
    constructor(public todoListService: TodoListService, public dialog: MatDialog) {

    }

    isHighlighted(todo: Todo): boolean {
        return todo._id['$oid'] === this.highlightedID['$oid'];
    }

    openDialog(): void {
        const dialogRef = this.dialog.open(AddTodoComponent, {
            width: '500px',
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed');
        });
    }


    public filterTodos(searchCategory: string, searchBody: string, searchStatus: boolean): Todo[] {

        this.filteredTodos = this.todos;

        // Filter by category
        if (searchCategory != null) {
            searchCategory = searchCategory.toLocaleLowerCase();

            this.filteredTodos = this.filteredTodos.filter(todo => {
                return !searchCategory || todo.category.toLowerCase().indexOf(searchCategory) !== -1;
            });
        }
        // Filter by body
        if (searchBody != null) {
            searchBody = searchBody.toLocaleLowerCase();

            this.filteredTodos = this.filteredTodos.filter(todo => {
                return !searchBody || todo.body.toLowerCase().indexOf(searchBody) !== -1;
            });
        }
        // Filter by status
        if (searchStatus != null) {
            this.filteredTodos = this.filteredTodos.filter((todo: Todo) => {
                return !searchStatus || (todo.status.toString().toLocaleLowerCase() === String(searchStatus).toLocaleLowerCase());
            });
        }
        return this.filteredTodos;
    }

    /**
     * Starts an asynchronous operation to update the todos list
     *
     */
    refreshTodos(): Observable<Todo[]> {
        // Get Todos returns an Observable, basically a "promise" that
        // we will get the data from the server.
        //
        // Subscribe waits until the data is fully downloaded, then
        // performs an action on it (the first lambda)

        const todos: Observable<Todo[]> = this.todoListService.getTodos();
        todos.subscribe(
            todos => {
                this.todos = todos;
                this.filterTodos(this.todoCategory, this.todoBody, this.todoStatus);
            },
            err => {
                console.log(err);
            });
        return todos;
    }


    loadService(): void {
        this.loadReady = true;
        this.todoListService.getTodos(this.todoOwner).subscribe(
            todos => {
                this.todos = todos;
                this.filteredTodos = this.todos;
            },
            err => {
                console.log(err);
            }
        );
    }


    ngOnInit(): void {
        this.refreshTodos();
        this.loadService();
    }
}
