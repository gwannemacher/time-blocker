package com.gracula.timeblocker.graphql;

import com.google.common.collect.ImmutableMap;
import graphql.schema.DataFetcher;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Component
public class GraphQLDataFetchers {
    private List<Map<String, String>> timeBlocks = new ArrayList();

    {
        timeBlocks.add(ImmutableMap.<String, String>builder()
                               .put("id", "timeblock-1")
                               .put("title", "haha")
                               .put("type", "meeting")
                               .put("startTime", "08:00")
                               .put("startDate", "2022-02-03")
                               .put("endTime", "10:00")
                               .put("endDate", "2022-02-03")
                               .build());

        timeBlocks.add(ImmutableMap.<String, String>builder()
                               .put("id", "timeblock-2")
                               .put("title", "haha 2")
                               .put("startTime", "09:00")
                               .put("startDate", "2022-02-04")
                               .put("endTime", "11:30")
                               .put("endDate", "2022-02-04")
                               .build());
    }

    public DataFetcher getTimeBlocksDataFetcher() {
        return dataFetchingEnvironment -> timeBlocks;
    }

    public DataFetcher<Map<String, String>> createTimeBlock() {
        return env -> {
            final String title = env.getArgument("title");
            final String type = env.getArgument("type");
            final String startTime = env.getArgument("startTime");
            final String startDate = env.getArgument("startDate");
            final String endTime = env.getArgument("endTime");
            final String endDate = env.getArgument("endDate");
            final Boolean isAllDay = env.getArgument("isAllDay");

            Map<String, String> timeBlock = ImmutableMap.<String, String>builder()
                    .put("id", java.util.UUID.randomUUID().toString())
                    .put("title", title)
                    .put("type", type)
                    .put("startTime", startTime)
                    .put("startDate", startDate)
                    .put("endTime", endTime)
                    .put("endDate", endDate)
                    .put("isAllDay", isAllDay.toString())
                    .build();

            timeBlocks.add(timeBlock);
            return timeBlock;
        };
    }

    public DataFetcher deleteTimeBlockDataFetcher() {
        return env -> {
            final String idToRemove = env.getArgument("id");
            timeBlocks.removeIf(t -> t.get("id").equalsIgnoreCase(idToRemove));
            return timeBlocks;
        };
    }
}
