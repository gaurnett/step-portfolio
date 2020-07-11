// Copyright 2019 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

package com.google.sps;

import java.io.Console;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.Collections;
import java.util.HashSet;

public final class FindMeetingQuery {
    ArrayList<TimeRange> meetingTimes = new ArrayList<>();

    /**
     * Function to find the meeting times possible based on a MeetingRequest and a
     * list of events.
     * 
     * @param events  Currently scheduled events
     * @param request Meeting request with specific duration and list of attendees
     * @return
     */
    public Collection<TimeRange> query(Collection<Event> events, MeetingRequest request) {
        ArrayList<Event> optionalEvents = new ArrayList<>();
        boolean mandatoryMeetingPresent = false;

        // Base case: if the request is greater than a day return an empty array
        if (request.getDuration() > TimeRange.WHOLE_DAY.duration()) {
            return Arrays.asList();
        }

        // Sets the available time to the whole day then split the time up if there are
        // any conflicts
        meetingTimes.add(TimeRange.WHOLE_DAY);

        for (Event event : events) {
            // If there are any optional attendees add the event to the list of optional
            // events
            if (!Collections.disjoint(event.getAttendees(), request.getOptionalAttendees())) {
                optionalEvents.add(event);
                continue;
            }

            // Check to see if there are any attendees in common. If not then ignore this
            // event
            if (Collections.disjoint(event.getAttendees(), request.getAttendees()))
                continue;

            mandatoryMeetingPresent = true;
            manageMeetingTime(event, request, mandatoryMeetingPresent, false);
        }

        for (Event optionalEvent : optionalEvents) {
            // If the optional attendee's event is all day then ignore them.
            if (optionalEvent.getWhen().equals(TimeRange.WHOLE_DAY))
                continue;

            manageMeetingTime(optionalEvent, request, mandatoryMeetingPresent, true);
        }

        return meetingTimes;
    }

    /**
     * Manages the meeting times for a request based on both optional and mandatory
     * events.
     * 
     * @param event   Event for attendees that are being requested to meet
     * @param request Request storing attendees and duration of time to meet
     */
    private void manageMeetingTime(Event event, MeetingRequest request, boolean mandatoryMeetingPresent,
            boolean optionalEvent) {

        ArrayList<TimeRange> previousMeetingTimes = new ArrayList<>(meetingTimes);

        for (TimeRange timeRange : previousMeetingTimes) {
            /**
             * This condition ensures that if there is only one meeting time remaining and
             * the difference between the optional event's duration and the meeting time
             * duration, the optional event treat is separately.
             */
            if (optionalEvent && meetingTimes.size() == 1
                    && Math.abs(event.getWhen().duration() - timeRange.duration()) < request.getDuration()) {
                // If there are only optional events, ensure that you remove the current free
                // meeting time if it's duration == the event duration
                if (!mandatoryMeetingPresent)
                    meetingTimes.remove(timeRange);
                return;
            }

            // Remove and add specific meeting times based on certain criteria. 
            if (timeRange.equals(event.getWhen())) {
                meetingTimes.remove(timeRange);
            } else if (timeRange.contains(event.getWhen())) { 
                addMeetingTime(timeRange.start(), event.getWhen().start(), request.getDuration(), false);
                addMeetingTime(event.getWhen().end(), timeRange.end(), request.getDuration(), false);
                meetingTimes.remove(timeRange);
            } else if (timeRange.overlaps(event.getWhen())) {
                meetingTimes.remove(timeRange);
                addMeetingTime(event.getWhen().end(), timeRange.end(), request.getDuration(), false);
            }
        }
    }

    /**
     * Adds a meeting to meetingTimes
     * 
     * @param start         The start of the available meeting time
     * @param end           The end of the available meeting time
     * @param duration      The duration of the meeting time
     * @param timeInclusive Whether or not the end time should be inclusive in the
     *                      range
     */
    private void addMeetingTime(int start, int end, long duration, boolean timeInclusive) {
        TimeRange range = TimeRange.fromStartEnd(start, end, timeInclusive);
        if (range.duration() >= duration) {
            meetingTimes.add(range);
        }
    }
}
