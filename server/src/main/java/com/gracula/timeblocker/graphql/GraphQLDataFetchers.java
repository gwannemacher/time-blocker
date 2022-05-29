package com.gracula.timeblocker.graphql;

import com.gracula.timeblocker.data.MongoDbClient;
import com.gracula.timeblocker.models.TimeBlock;
import com.mongodb.client.model.Updates;
import graphql.schema.DataFetcher;
import org.bson.conversions.Bson;
import org.springframework.stereotype.Component;

import java.time.*;
import java.time.temporal.TemporalAdjusters;
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

    private List<TimeBlock> getTimeBlocksForWeekFromDb(Long currentDayMilliseconds) {
        LocalDateTime date = Instant
                .ofEpochMilli(currentDayMilliseconds)
                .atZone(ZoneId.systemDefault())
                .toLocalDateTime();
        LocalDateTime previousSunday = date.with(TemporalAdjusters.previous(DayOfWeek.SUNDAY));
        LocalDateTime nextSunday = date.with(TemporalAdjusters.next(DayOfWeek.SUNDAY));

        return StreamSupport.stream(mongoClient.timeBlockCollection
                .find(and(
                        gte("startDateTime", previousSunday.atZone(ZoneId.systemDefault()).toInstant().toEpochMilli()),
                        lte("startDateTime", nextSunday.atZone(ZoneId.systemDefault()).toInstant().toEpochMilli())))
                .spliterator(), false)
                .collect(Collectors.toList());
    }

    public DataFetcher getTimeBlocksForWeekDataFetcher() {
        return env -> {
            final Double currentDayDateTime = env.getArgument("currentDay");
            return getTimeBlocksForWeekFromDb(currentDayDateTime.longValue());
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
