package com.gracula.timeblocker.graphql;

import com.gracula.timeblocker.data.MongoDbClient;
import com.gracula.timeblocker.models.TimeBlock;
import graphql.schema.DataFetcher;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import static com.mongodb.client.model.Filters.eq;

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

    public DataFetcher<TimeBlock> createTimeBlock() {
        return env -> {
            final TimeBlock block = new TimeBlock();
            block.setId(java.util.UUID.randomUUID().toString());
            block.setTitle(env.getArgument("title"));
            block.setType(env.getArgument("type"));
            block.setStartTime(env.getArgument("startTime"));
            block.setStartDate(env.getArgument("startDate"));
            block.setEndTime(env.getArgument("endTime"));
            block.setEndDate(env.getArgument("endDate"));
            block.setAllDay(env.getArgument("isAllDay"));

            mongoClient.timeBlockCollection.insertOne(block);

            return block;
        };
    }

    public DataFetcher deleteTimeBlockDataFetcher() {
        return env -> {
            final String idToRemove = env.getArgument("id");
            mongoClient.timeBlockCollection.deleteOne(eq("_id", idToRemove));
            return idToRemove;
        };
    }
}
