package umm3601.todo;

import com.google.gson.Gson;
import com.mongodb.MongoException;
import com.mongodb.client.FindIterable;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import com.mongodb.util.JSON;
import org.bson.Document;
import org.bson.types.ObjectId;

import java.util.*;

import com.mongodb.MongoClient;
import com.mongodb.client.model.Aggregates;
import com.mongodb.client.model.Accumulators;
import com.mongodb.client.model.Filters;
import com.mongodb.client.AggregateIterable;
import com.mongodb.client.MongoCursor;

import static com.mongodb.client.model.Filters.eq;

/**
 * Controller that manages requests for info about todos.
 */
public class TodoController {

    private final Gson gson;
    private MongoDatabase database;
    private final MongoCollection<Document> todoCollection;

    /**
     * Construct a controller for todos.
     *
     * @param database the database containing todos data
     */
    public TodoController(MongoDatabase database) {
        gson = new Gson();
        this.database = database;
        todoCollection = database.getCollection("todos");
    }

    /**
     * Helper method that gets a single todos specified by the `id`
     * parameter in the request.
     *
     * @param id the Mongo ID of the desired todos
     * @return the desired todos as a JSON object if the todos with that ID is found,
     * and `null` if no todos with that ID is found
     */
    public String getTodo(String id) {
        FindIterable<Document> jsonTodos
            = todoCollection
            .find(eq("_id", new ObjectId(id)));

        Iterator<Document> iterator = jsonTodos.iterator();
        if (iterator.hasNext()) {
            Document todo = iterator.next();
            return todo.toJson();
        } else {
            // We didn't find the desired todos
            return null;
        }
    }


    /** Helper method which iterates through the collection, receiving all
     * documents if no query parameter is specified. If the owner query parameter
     * is specified, then the collection is filtered so only documents of that
     * specified owner are found.
     *
     * @param queryParams
     * @return an array of Todos in a JSON formatted string
     */
    public String getTodos(Map<String, String[]> queryParams) {

        Document filterDoc = new Document();

        if (queryParams.containsKey("owner")) {
            String targetContent = (queryParams.get("owner")[0]);
            Document contentRegQuery = new Document();
            contentRegQuery.append("$regex", targetContent);
            contentRegQuery.append("$options", "i");
            filterDoc = filterDoc.append("owner", contentRegQuery);
        }

        //FindIterable comes from mongo, Document comes from Gson
        FindIterable<Document> matchingTodos = todoCollection.find(filterDoc);

        return JSON.serialize(matchingTodos);
    }


    /**
     * Helper method which appends received todos information to the to-be added document
     *
     * @param owner
     * @param category
     * @param status
     * @param body
     * @return boolean after successfully or unsuccessfully adding a todos
     */
    public String addNewTodo(String owner, String category, boolean status, String body) {

        Document newTodo = new Document();
        newTodo.append("owner", owner);
        newTodo.append("status", status);
        newTodo.append("category", category);
        newTodo.append("body", body);

        try {
            todoCollection.insertOne(newTodo);
            ObjectId id = newTodo.getObjectId("_id");
            System.err.println("Successfully added new todo [_id=" + id + ", owner=" + owner + ", category=" + category + " status=" + status + " body=" + body + ']');
            // return JSON.serialize(newTodo);
            return JSON.serialize(id);
        } catch(MongoException me) {
            me.printStackTrace();
            return null;
        }
    }

    public String getTodoSummary() {

        float count = todoCollection.count();
        float percent = 100/count;

        Document doc = new Document();

        //Breakdown of todos by owners by percentage
        AggregateIterable<Document> breakdownOwner = todoCollection.aggregate(
            Arrays.asList(
                Aggregates.group("$owner", Accumulators.sum("count", 1), Accumulators.sum("percentage_of_total_todos", percent))
            )
        );

        doc.append("breakDownOwners", breakdownOwner);

        //Here we are getting all of the unique owners and categories from the Todos

        AggregateIterable<Document> owners0 = todoCollection.aggregate(

            Arrays.asList(
                Aggregates.group("$owner")
            )
        );

        AggregateIterable<Document> categories0 = todoCollection.aggregate(

            Arrays.asList(
                Aggregates.group("$category")
            )
        );

        LinkedHashMap<String, Integer> map_owner = new LinkedHashMap<String, Integer>();
        MongoCursor<Document> owner_iterator = owners0.iterator();
        while (owner_iterator.hasNext()) {
            Document next = owner_iterator.next();
            map_owner.put(next.getString("_id"), next.getInteger("_count"));
        }


        LinkedHashMap<String, Integer> map_categories = new LinkedHashMap<String, Integer>();
        MongoCursor<Document> categories_iterator = categories0.iterator();
        while (categories_iterator.hasNext()) {
            Document next = categories_iterator.next();
            map_categories.put(next.getString("_id"), next.getInteger("_count"));
        }
        // Turn the unique categories and owners into object arrays
        Object[] owners = map_owner.keySet().toArray();
        Object[] categories = map_categories.keySet().toArray();

        System.out.println(JSON.serialize(owners));
        System.out.println(JSON.serialize(categories));

        // Instead of getting the count, get the percentage of one category/owner

        float[] owners_total = new float[owners.length];
        float[] category_total = new float[categories.length];



        for(int i = 0; i < owners.length; i++){
            Document newDoc = new Document("owner", owners[i]);
            owners_total[i] = 100 / (float)todoCollection.count(newDoc);
        }

        for(int i = 0; i < categories.length; i++){
            Document newDoc = new Document("category", categories[i]);
            category_total[i] = 100 / (float)todoCollection.count(newDoc);
        }

        System.out.println(categories.length);
        System.out.println(owners.length);

        // Append owners and categories information to the doc Document

        for (int i = 0; i < owners.length; i++) {
            doc.append(owners[i] + ": OwnersPercentageComplete", todoCollection.aggregate(
                Arrays.asList(
                    Aggregates.match(Filters.eq("owner", owners[i])),
                    Aggregates.match(Filters.eq("status", true)),
                    Aggregates.group("$owner", Accumulators.sum("Completed Todos", 1) , Accumulators.sum("Percentage Completed", owners_total[i]))
                )
                )
            );
        }

        for (int i = 0; i < categories.length; i++) {
            doc.append(categories[i] + ": CategoriesPercentageComplete", todoCollection.aggregate(
                Arrays.asList(
                    Aggregates.match(Filters.eq("category", categories[i])),
                    Aggregates.match(Filters.eq("status", true)),
                    Aggregates.group("$category", Accumulators.sum("Completed Todos", 1) , Accumulators.sum("Percentage Completed", category_total[i]))
                )
                )
            );
        }

        //System.out.println(doc.toJson());

        return doc.toJson();
    }

    public static void main(String[] args) {
        MongoClient mongoClient = new MongoClient();
        MongoDatabase todoDatabase = mongoClient.getDatabase("dev");
        TodoController todoController = new TodoController(todoDatabase);

        System.out.println(todoController.getTodoSummary());
    }
}
