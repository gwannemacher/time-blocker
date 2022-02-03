package com.gracula.timeblocker.graphql;

import com.google.common.collect.ImmutableMap;
import graphql.schema.DataFetcher;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;
import java.util.Map;

@Component
public class GraphQLDataFetchers {
    private static List<Map<String, String>> timeBlocks = Arrays.asList(
            ImmutableMap.<String, String>builder()
                    .put("id", "timeblock-1")
                    .put("title", "haha")
                    .put("startTime", "8:00am")
                    .put("startDate", "2022-02-03")
                    .put("endTime", "10:00am")
                    .put("endDate", "2022-02-03")
                    .build(),
            ImmutableMap.<String, String>builder()
                    .put("id", "timeblock-2")
                    .put("title", "haha 2")
                    .put("startTime", "9:00am")
                    .put("startDate", "2022-02-04")
                    .put("endTime", "11:30am")
                    .put("endDate", "2022-02-04")
                    .build()
    );

    public DataFetcher getTimeBlocksDataFetcher() {
        return dataFetchingEnvironment -> timeBlocks;
    }
}
