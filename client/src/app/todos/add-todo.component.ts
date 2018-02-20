import {Component, Inject} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material'
import {TodoListService} from "./todo-list.service";
import {Todo} from "./todo";


@Component({
    selector: 'add-todo.component',
    templateUrl: 'add-todo.component.html',
})
export class AddTodoComponent {
    public newTodoName:string;
    public newTodoAge: number;
    public newTodoCompany: string;
    public newTodoEmail: string;
    private todoAddSuccess : Boolean = false;

    public todos: Todo[];

    constructor(public todoListService: TodoListService,
        public dialogRef: MatDialogRef<AddTodoComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any) { }

    onNoClick(): void {
        this.dialogRef.close();
    }

    addNewTodo(name: string, age: number, company : string, email : string) : void{

        //Here we clear all the fields, there's probably a better way
        //of doing this could be with forms or something else
        this.newTodoName = null;
        this.newTodoAge = null;
        this.newTodoCompany = null;
        this.newTodoEmail = null;

        this.todoListService.addNewTodo(name, age, company, email).subscribe(
            succeeded => {
                this.todoAddSuccess = succeeded;
                // Once we added a new Todo, refresh our todo list.
                // There is a more efficient method where we request for
                // this new todo from the server and add it to todos, but
                // for this lab it's not necessary
                //this.todoListComponent.refreshTodos();
            });
    }

}
