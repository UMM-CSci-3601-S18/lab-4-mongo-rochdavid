import {Component, Inject} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {Todo} from './todo';

@Component({
    selector: 'add-todo.component',
    templateUrl: 'add-todo.component.html',
})
export class AddTodoComponent {
    constructor(
        public dialogRef: MatDialogRef<AddTodoComponent>,
        @Inject(MAT_DIALOG_DATA) public data: {todo: Todo}) {
    }

    onNoClick(): void {
        this.dialogRef.close();
    }
}
