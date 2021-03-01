import React, { useState } from "react";
import "./App.css";
import "./components/navButton";
import NavButton from "./components/navButton";
import Calendar from "./components/calendar";
import BreakItButton from "./components/breakItButton";
import presetEvents from "./util/events";
import moment from "moment";

function App() {
    const [modeSelected, setModeSelected] = useState("d");
    const [date, setDate] = useState(new Date());
    const [events, setEvents] = useState(presetEvents);

    const insertionNeeded = (breakDate) => {
        let sameDateEvents = getEvents(breakDate);
        let [breakStart] = getBreakTiming(sameDateEvents);
        return breakStart != null;
    };

    const insertBreaks = (breakDate) => {
        let sameDateEvents = getEvents(breakDate);
        let [breakStart, breakEnd] = getBreakTiming(sameDateEvents);
        while (breakStart != null) {
            console.log(`found break to insert: ${breakStart}, ${breakEnd}`);
            /* insert breaks */
            [breakStart, breakEnd] = [null, null] /* getBreakTiming() */;
        }
    };

    return (
        <div className="App">
            <header className="App-header">
                <img
                    src="./images/gradient.png"
                    alt="icon background"
                    className="logo-img"
                />
                <h1>break.er</h1>
                <NavButton
                    icon="./icons/calendar-day.svg"
                    selectedIcon="./icons/calendar-day-selected.svg"
                    alt="day"
                    selected={modeSelected === "d"}
                    onClick={() => setModeSelected("d")}
                />
                <NavButton
                    icon="./icons/calendar-week.svg"
                    selectedIcon="./icons/calendar-week-selected.svg"
                    alt="week"
                    selected={modeSelected === "w"}
                    onClick={() => setModeSelected("w")}
                />
                <NavButton
                    icon="./icons/calendar-month.svg"
                    selectedIcon="./icons/calendar-month-selected.svg"
                    alt="month"
                    selected={modeSelected === "M"}
                    onClick={() => setModeSelected("M")}
                />
                <div
                    style={{
                        display: "flex",
                        flex: "1",
                        flexDirection: "row",
                        justifyContent: "flex-end",
                        paddingRight: "30px",
                    }}
                >
                    <BreakItButton
                        onClick={() => {
                            if (modeSelected === "d") {
                                if (insertionNeeded(date)) {
                                    insertBreaks(date);
                                } else {
                                    console.log("all good");
                                }
                            }
                        }}
                    />
                </div>
            </header>
            <main>
                <Calendar
                    mode={modeSelected}
                    onMonthDaySelected={() => setModeSelected("d")}
                    events={events}
                    onDateChange={(newDate) => setDate(newDate)}
                    onEventsChange={(newEvents) => setEvents(newEvents)}
                />
            </main>
        </div>
    );

    function diffHours(workEnded, workStarted) {
        return workEnded.diff(workStarted, "hours", true);
    }

    function getEvents(breakDate) {
        let sameDateEvents = events.filter((ev) =>
            moment(breakDate).isSame(moment(ev.start), "day")
        );

        sameDateEvents.sort((e1, e2) =>
            moment(e1.start).isBefore(moment(e2.start)) ? -1 : 1
        );
        return sameDateEvents;
    }

    function getBreakTiming(eventArray) {
        let workStart = null,
            workEnd = null;
        let breakStart = null,
            breakEnd = null;
        eventArray.some((element) => {
            if (!element.isABreak) {
                if (!workStart) {
                    workStart = moment(element.start);
                    workEnd = moment(element.end);
                } else {
                    if (workEnd.isSame(moment(element.start))) {
                        workEnd = moment(element.end);
                    } else {
                        workStart = moment(element.start);
                        workEnd = moment(element.end);
                    }
                }
                let workLength = diffHours(workEnd, workStart);
                console.log(
                    `cur ev: ${element.title}, workLength > 1.5: ${
                        workLength > 1.5
                    }`
                );
                if (workLength > 1.5) return true;
            } else {
                if (workStart) {
                    let workLength = diffHours(workEnd, workStart);
                    if (workLength > 1.5) return true;
                    workStart = workEnd = null;
                }
            }
            return false;
        });
        breakStart = workEnd;
        breakEnd = breakStart ? moment(breakStart).add(20, "minutes") : null;
        return [breakStart, breakEnd];
    }
}

export default App;
