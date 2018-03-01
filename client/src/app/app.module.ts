import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { MATERIAL_COMPATIBILITY_MODE } from '@angular/material';
import {MatSelectModule} from '@angular/material/select';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {CommonModule} from '@angular/common';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';


import {HttpClientModule} from '@angular/common/http';
import {AppComponent} from './app.component';
import {HomeComponent} from './home/home.component';
import {UserComponent} from './users/user.component';
import {UserListComponent} from './users/user-list.component';
import {UserListService} from './users/user-list.service';
import {Routing} from './app.routes';
import {APP_BASE_HREF} from '@angular/common';

import {CustomModule} from './custom.module';
import {AddUserComponent} from './users/add-user.component';

import {TodoComponent} from './todos/todo.component';
import {TodoListComponent} from './todos/todo-list.component';
import {TodoListService} from './todos/todo-list.service';
import {AddTodoComponent} from './todos/add-todo.component';

@NgModule({
    imports: [
        BrowserModule,
        HttpClientModule,
        Routing,
        CustomModule,
        MatSelectModule,
        MatProgressBarModule,
        MatProgressSpinnerModule,
        CommonModule
    ],
    declarations: [
        AppComponent,
        HomeComponent,
        UserListComponent,
        UserComponent,
        AddUserComponent,
        TodoListComponent,
        TodoComponent,
        AddTodoComponent
    ],
    providers: [
        UserListService,
        TodoListService,
        {provide: APP_BASE_HREF, useValue: '/'},
        {provide: MATERIAL_COMPATIBILITY_MODE, useValue: true}
    ],
    entryComponents: [
        AddUserComponent,
        AddTodoComponent
    ],
    schemas: [
        CUSTOM_ELEMENTS_SCHEMA,
        NO_ERRORS_SCHEMA
    ],
    bootstrap: [AppComponent]
})

export class AppModule {
}
