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

    public MongoDbClient(
            @Value("${mongodb.url}") String mongoDbUrl,
            @Value("${mongodb.database.name}") String databaseName,
            @Value("${mongodb.collection.time_block.name}") String timeBlockCollectionName) {
        final CodecProvider pojoCodecProvider = PojoCodecProvider.builder().automatic(true).build();
        final CodecRegistry pojoCodecRegistry = fromRegistries(
                getDefaultCodecRegistry(), fromProviders(pojoCodecProvider));

        final MongoClient mongoClient = MongoClients.create(mongoDbUrl);
        final MongoDatabase database = mongoClient
                .getDatabase(databaseName)
                .withCodecRegistry(pojoCodecRegistry);

        timeBlockCollection = database.getCollection(timeBlockCollectionName, TimeBlock.class);
    }
}
