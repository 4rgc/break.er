import React, { useState } from "react";
import logo from "./logo.svg";
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
    const [breakParams, setBreakParams] = useState({
        longestWorkingTime: 60,
        shortBreakTime: 10,
    });

    const breakingNeeded = (date) => {
        let sameDateEvents = events.filter((ev) => {
            moment(date).isSame(moment(ev.start), "day");
        });

        let firstWorkEvent = sameDateEvents.sort((e1, e2) => moment(e1.start));
        return false;
    };

    return (
        <div className="App">
            <header className="App-header">
                <img src="./images/gradient.png" className="logo-img" />
                <h1>break.er</h1>
                <NavButton
                    icon="./icons/calendar-day.svg"
                    selectedIcon="./icons/calendar-day-selected.svg"
                    alt="day"
                    selected={modeSelected == "d"}
                    onClick={() => setModeSelected("d")}
                />
                <NavButton
                    icon="./icons/calendar-week.svg"
                    selectedIcon="./icons/calendar-week-selected.svg"
                    alt="week"
                    selected={modeSelected == "w"}
                    onClick={() => setModeSelected("w")}
                />
                <NavButton
                    icon="./icons/calendar-month.svg"
                    selectedIcon="./icons/calendar-month-selected.svg"
                    alt="month"
                    selected={modeSelected == "M"}
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
                            if (modeSelected == "d") {
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
