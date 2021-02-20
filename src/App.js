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

    const breakingNeeded = (breakDate) => {
        let sameDateEvents = events.filter((ev) =>
            moment(breakDate).isSame(moment(ev.start), "day")
        );

        sameDateEvents.sort((e1, e2) =>
            moment(e1.start).isBefore(moment(e2.start) ? -1 : 1)
        ); // first work event
        return false;
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
                                if (breakingNeeded(date)) {
                                    console.log("inserted breaks");
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
}

export default App;
