package umm3601.mongotest;

import com.mongodb.MongoClient;
import com.mongodb.client.*;
import com.mongodb.client.model.Accumulators;
import com.mongodb.client.model.Aggregates;
import com.mongodb.client.model.Sorts;
import org.bson.Document;
import org.junit.Before;
import org.junit.Test;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import static com.mongodb.client.model.Filters.*;
import static com.mongodb.client.model.Projections.*;
import static org.junit.Assert.*;

/**
 * Some simple "tests" that demonstrate our ability to
 * connect to a Mongo database and run some basic queries
 * against it.
 *
 * Note that none of these are actually tests of any of our
 * code; they are mostly demonstrations of the behavior of
 * the MongoDB Java libraries. Thus if they test anything,
 * they test that code, and perhaps our understanding of it.
 *
 * To test "our" code we'd want the tests to confirm that
 * the behavior of methods in things like the TodoController
 * do the "right" thing.
 *
 * Created by mcphee on 20/2/17.
 */
public class MongoSpecTodo {

    private MongoCollection<Document> todoDocuments;

    @Before
    public void clearAndPopulateDB() {
        MongoClient mongoClient = new MongoClient();
        MongoDatabase db = mongoClient.getDatabase("test");
        todoDocuments = db.getCollection("todos");
        todoDocuments.drop();
        List<Document> testTodos = new ArrayList<>();
        testTodos.add(Document.parse("{\n" +
            "                    owner: \"Chris\",\n" +
            "                    status: false,\n" +
            "                    body: \"UMM\",\n" +
            "                    category: \"this\"\n" +
            "                }"));
        testTodos.add(Document.parse("{\n" +
            "                    owner: \"Pat\",\n" +
            "                    status: false,\n" +
            "                    body: \"IBM\",\n" +
            "                    category: \"something\"\n" +
            "                }"));
        testTodos.add(Document.parse("{\n" +
            "                    owner: \"Jamie\",\n" +
            "                    status: false,\n" +
            "                    body: \"Frogs, Inc.\",\n" +
            "                    category: \"frogs\"\n" +
            "                }"));
        todoDocuments.insertMany(testTodos);
    }

    private List<Document> intoList(MongoIterable<Document> documents) {
        List<Document> todos = new ArrayList<>();
        documents.into(todos);
        return todos;
    }

    private int countTodos(FindIterable<Document> documents) {
        List<Document> todos = intoList(documents);
        return todos.size();
    }

    @Test
    public void shouldBeThreeTodos() {
        FindIterable<Document> documents = todoDocuments.find();
        int numberOfTodos = countTodos(documents);
        assertEquals("Should be 3 total todos", 3, numberOfTodos);
    }

    @Test
    public void shouldBeOneChris() {
        FindIterable<Document> documents = todoDocuments.find(eq("owner", "Chris"));
        int numberOfTodos = countTodos(documents);
        assertEquals("Should be 1 Chris", 1, numberOfTodos);
    }

    @Test
    public void shouldBeOneJamie() {
        FindIterable<Document> documents = todoDocuments.find(gt("owner", "Jamie"));
        int numberOfTodos = countTodos(documents);
        assertEquals("Should be 1 Jamie", 1, numberOfTodos);
    }

}
