## Questions

1. :question: What do we do in the `Server` main method and `UserController` constructors
to set up our connection to the development database?
1. :question: How do we retrieve a user by ID in the `UserController.getUser(String)` method?
1. :question: How do we retrieve all the users with a given age 
in `UserController.getUsers(Map...)`? What's the role of `filterDoc` in that
method?
1. :question: What are these `Document` objects that we use in the `UserController`? 
Why and how are we using them?
1. :question: What does `UserControllerSpec.clearAndPopulateDb` do?
1. :question: What's being tested in `UserControllerSpec.getUsersWhoAre37()`?
How is that being tested?
1. :question: Follow the process for adding a new user. What role do `UserController` and 
`UserRequestHandler` play in the process?

## Your Team's Answers

1. :answer: UserController creates a controller for users. Creates a new gson object. Assigns a database. Gets the collection
users from the DB. Server assigns a server port and name. Creates a blank mongo collection. Uses the userDatabase, userController,
and userRequestHandler to allow for users to be added and pulled.

1. :answer: Searches userCollection by field _id for the given ID, and assigns the returned document to the object jsonUser.
Then, using iterator, it checks whether the jsonUser has something in it using the iterator's hasNext method, and returns the
first element in this list if it has.

1. :answer: getUsers by age searches the mongoDB and if a field age exists it gets the first age and appends to targetAge.
filterDoc works to set the age to the targetAge.

1. :answer: Document serves as a collection in mongoDB. The Document is a java oject that represents a JSON object. We are using
them to hold the data from mongoDB.

1. :answer: First line creates a blank DB then later adds three new users.

1. :answer: UserControllerSpec.getUsersWhoAre37 looks at all users with an age field. Looks for the given age '37' and looks to see
that the result returns 2 users. It is tested using an assertEquals.

1. :answer: UserRequestHandler.java makes a space for the fields. UserController.java allows for the input of data for each field.
Then the handler reacts by returning userController.addNewUser or returning false and an appropriate error.
