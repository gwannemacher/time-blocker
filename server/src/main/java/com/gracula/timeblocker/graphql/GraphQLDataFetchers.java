package com.gracula.timeblocker.graphql;

import com.gracula.timeblocker.data.MongoDbClient;
import com.gracula.timeblocker.models.TimeBlock;
import com.mongodb.client.model.Updates;
import graphql.schema.DataFetcher;
import org.bson.conversions.Bson;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import static com.mongodb.client.model.Filters.*;

@Component
public class GraphQLDataFetchers {
    private final MongoDbClient mongoClient;

    public GraphQLDataFetchers(MongoDbClient client) {
        mongoClient = client;
    }

    private List<TimeBlock> getTimeBlocksFromDb() {
        return StreamSupport.stream(mongoClient.timeBlockCollection.find().spliterator(), false)
                .collect(Collectors.toList());
    }

    public DataFetcher getTimeBlocksDataFetcher() {
        return dataFetchingEnvironment -> getTimeBlocksFromDb();
    }

    private List<TimeBlock> getTimeBlocksInRangeFromDb(Long startMilliseconds, Long endMilliseconds) {
        return StreamSupport.stream(mongoClient.timeBlockCollection
                .find(and(
                        gte("startDateTime", startMilliseconds),
                        lte("startDateTime", endMilliseconds)))
                .spliterator(), false)
                .collect(Collectors.toList());
    }

    public DataFetcher getTimeBlocksInRangeDataFetcher() {
        return env -> {
            final Double start = env.getArgument("start");
            final Double end = env.getArgument("end");
            return getTimeBlocksInRangeFromDb(start.longValue(), end.longValue());
        };
    }

    public DataFetcher<TimeBlock> createTimeBlock() {
        return env -> {
            final TimeBlock block = new TimeBlock();

            block.setId(java.util.UUID.randomUUID().toString());
            block.setTitle(env.getArgument("title"));
            block.setType(env.getArgument("type"));
            block.setAllDay(env.getArgument("isAllDay"));

            final Double startDateTime = env.getArgument("startDateTime");
            block.setStartDateTime(startDateTime.longValue());
            final Double endDateTime = env.getArgument("endDateTime");
            block.setEndDateTime(endDateTime.longValue());

            mongoClient.timeBlockCollection.insertOne(block);

            return block;
        };
    }

    public DataFetcher deleteTimeBlockDataFetcher() {
        return env -> {
            final String id = env.getArgument("id");
            mongoClient.timeBlockCollection.deleteOne(eq("_id", id));
            return id;
        };
    }

    public DataFetcher<TimeBlock> updateTimeBlockTitle() {
        return env -> {
            final String id = env.getArgument("id");
            final String title = env.getArgument("title");
            final Bson updates = Updates.combine(
                    Updates.set("title", title)
            );
            mongoClient.timeBlockCollection.findOneAndUpdate(eq("_id", id), updates);
            TimeBlock newBlock = mongoClient.timeBlockCollection.find(
                    eq("_id", id)).first();
            return newBlock;
        };
    }

    public DataFetcher<TimeBlock> updateTimeBlockTimes() {
        return env -> {
            final String id = env.getArgument("id");
            final Double startDateTime = env.getArgument("startDateTime");
            final Double endDateTime = env.getArgument("endDateTime");
            final Bson updates = Updates.combine(
                    Updates.set("startDateTime", startDateTime.longValue()),
                    Updates.set("endDateTime", endDateTime.longValue())
            );
            mongoClient.timeBlockCollection.findOneAndUpdate(eq("_id", id), updates);
            TimeBlock newBlock = mongoClient.timeBlockCollection.find(
                    eq("_id", id)).first();
            return newBlock;
        };
    }
}
