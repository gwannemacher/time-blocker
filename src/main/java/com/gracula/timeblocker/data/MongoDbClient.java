package com.gracula.timeblocker.data;

import com.gracula.timeblocker.models.TimeBlock;
import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import org.bson.codecs.configuration.CodecProvider;
import org.bson.codecs.configuration.CodecRegistry;
import org.bson.codecs.pojo.PojoCodecProvider;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.PropertySource;
import org.springframework.stereotype.Component;

import static com.mongodb.MongoClientSettings.getDefaultCodecRegistry;
import static org.bson.codecs.configuration.CodecRegistries.fromProviders;
import static org.bson.codecs.configuration.CodecRegistries.fromRegistries;

@Component
@PropertySource("classpath:application.properties")
public class MongoDbClient {
    public final MongoCollection<TimeBlock> timeBlockCollection;

    public MongoDbClient() {
        System.out.println("**********");
        System.out.println(System.getenv("MONGO_USERNAME"));
        System.out.println("**********");

        System.getenv().forEach((k, v) -> {
            System.out.println(k + ":" + v);
        });


        final String mongoDbUrl = String.format(
                "mongodb+srv://%s:%s@%s.%s.mongodb.net/%s?retryWrites=true&w=majority",
                System.getenv("MONGO_USERNAME"),
                System.getenv("MONGO_PASSWORD"),
                System.getenv("MONGO_CLUSTER_NAME"),
                System.getenv("MONGO_CLUSTER_THINGY"),
                System.getenv("MONGO_DB_NAME_THINGY"));

        System.out.println("--------");
        System.out.println(mongoDbUrl);
        System.out.println("--------");
        final CodecProvider pojoCodecProvider = PojoCodecProvider.builder().automatic(true).build();
        final CodecRegistry pojoCodecRegistry = fromRegistries(
                getDefaultCodecRegistry(), fromProviders(pojoCodecProvider));

        final MongoClient mongoClient = MongoClients.create(mongoDbUrl);
        final MongoDatabase database = mongoClient
                .getDatabase(System.getenv("MONGO_DB_NAME"))
                .withCodecRegistry(pojoCodecRegistry);

        timeBlockCollection = database.getCollection("time_blocks", TimeBlock.class);
    }
}
