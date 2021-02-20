import React, { Component } from "react";
import { Calendar, Views, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import "react-big-calendar/lib/addons/dragAndDrop/styles.scss";
import moment from "moment";
import "../styles/calendar.css";
import PopUp from "./popUp";

const DragAndDropCalendar = withDragAndDrop(Calendar);

const MyToolbar = (props) => {
    return (
        <div className="toolbarContainer">
            <span className="calendarNavButton" onClick={props.onPrev}>
                Previous
            </span>
            <span class="dateIndicator">
                {props.mode === "d"
                    ? moment(props.date).format("MMM DD, YYYY")
                    : props.mode === "w"
                    ? "Week of " + moment(props.date).format("MMM DD, YYYY")
                    : props.mode === "M"
                    ? moment(props.date).format("MMMM")
                    : ""}
            </span>
            <span className="calendarNavButton" onClick={props.onNext}>
                Next
            </span>
        </div>
    );
};

const MyWeekHeader = (props) => {
    return (
        <div className="weekHeader">
            <span>{moment(props.date).format("ddd D")}</span>
            <br></br>
            <span>Work: 90%; Breaks: 10%</span>
        </div>
    );
};

class Dnd extends Component {
    constructor(props) {
        super(props);
        this.state = {
            events: props.events,
            date: new Date("2021/02/04"),
            displayDragItemInCell: true,
            localizer: momentLocalizer(moment),
            showPopUp: false,
            //TODO: $B1: fix bad code
            isChangingFromMonthToDay: false,
        };
        this.dateChange(this.state.date);

        this.components = {
            toolbar: () =>
                MyToolbar({
                    onNext: () => {
                        const newDate = moment(this.state.date)
                            .add(1, this.props.mode)
                            .toDate();
                        this.setState({
                            date: newDate,
                        });
                        this.dateChange(newDate);
                    },
                    onPrev: () => {
                        const newDate = moment(this.state.date)
                            .add(-1, this.props.mode)
                            .toDate();
                        this.setState({
                            date: newDate,
                        });
                        this.dateChange(newDate);
                    },
                    date: this.state.date,
                    mode: this.props.mode,
                }),
            week: {
                header: MyWeekHeader,
            },
            month: {
                event: () => <div className="monthEventWrapper" />,
            },
            dateCellWrapper: (date) => {
                return (
                    <div
                        style={{
                            flex: 1,
                            zIndex: 5,
                            borderRight: "1px lightgray solid",
                        }}
                        onClick={() => {
                            //TODO: $B1
                            this.setState({
                                date: date.value,
                                isChangingFromMonthToDay: true,
                            });
                            props.onMonthDaySelected(date.value);
                            this.dateChange(date.value);
                        }}
                    >
                        <h4>Work: 90%</h4>
                        <h4>Breaks: 10%</h4>
                    </div>
                );
            },
        };

        this.moveEvent = this.moveEvent.bind(this);
        this.newEvent = this.newEvent.bind(this);
    }

    dateChange(newDate) {
        this.props.onDateChange && this.props.onDateChange(newDate);
    }

    eventsChange(newEvents) {
        this.props.onEventsChange && this.props.onEventsChange(newEvents);
    }

    togglePopUp = () => {
        this.setState({ showPopUp: !this.state.showPopUp });
    };

    handleDragStart = (event) => {
        this.setState({ draggedEvent: event });
    };

    dragFromOutsideItem = () => {
        return this.state.draggedEvent;
    };

    onDropFromOutside = ({ start, end, allDay }) => {
        const { draggedEvent } = this.state;

        const event = {
            id: draggedEvent.id,
            title: draggedEvent.title,
            start,
            end,
            allDay: allDay,
        };

        this.setState({ draggedEvent: null });
        this.moveEvent({ event, start, end });
    };

    moveEvent = ({ event, start, end, isAllDay: droppedOnAllDaySlot }) => {
        const { events } = this.state;

        const nextEvents = events.map((existingEvent) => {
            return existingEvent.id === event.id
                ? { ...existingEvent, start, end }
                : existingEvent;
        });

        this.setState({
            events: nextEvents,
        });

        this.eventsChange(nextEvents);

        // alert(`${event.title} was dropped onto ${updatedEvent.start}`)
    };

    resizeEvent = ({ event, start, end }) => {
        const { events } = this.state;

        const nextEvents = events.map((existingEvent) => {
            return existingEvent.id === event.id
                ? { ...existingEvent, start, end }
                : existingEvent;
        });

        this.setState({
            events: nextEvents,
        });

        this.eventsChange(nextEvents);

        //alert(`${event.title} was resized to ${start}-${end}`)
    };

    newEvent(event) {
        //TODO: $B1 (to prevent pop up from showing in the month view)
        if (this.state.isChangingFromMonthToDay) {
            this.setState({
                isChangingFromMonthToDay: false,
            });
            return;
        }

        if (this.eventOverlaps(event)) return;

        let idList = this.props.events.map((a) => a.id);
        let newId = Math.max(...idList) + 1;

        let e = {
            id: newId,
            title: "New Event",
            start: event.start,
            end: event.end,
            color: "#3575ab",
            isBreakable: true,
            isABreak: false,
        };

        const newEvents = this.props.events.concat([e]);

        this.setState({
            events: newEvents,
            eventInPopUp: e,
            showPopUp: true,
        });
        this.eventsChange(newEvents);
    }

    eventOverlaps(event) {
        const overlaps = this.props.events.filter(
            (e) =>
                moment(event.start).isBetween(moment(e.start), moment(e.end)) ||
                moment(event.end).isBetween(moment(e.start), moment(e.end)) ||
                moment(e.start).isBetween(
                    moment(event.start),
                    moment(event.end)
                )
        );
        return overlaps.length > 0;
    }

    eventStyleGetter(event, start, end, isSelected) {
        var backgroundColor = event.color;
        var style = {
            backgroundColor: backgroundColor,
            borderRadius: "10px",
            opacity: 0.9,
            color: "black",
            border: "1px solid black",
            display: "block",
        };
        return {
            style: style,
        };
    }

    selectEvent(event) {
        console.log(event);
        this.setState({
            eventInPopUp: event,
            showPopUp: true,
        });
    }

    render() {
        const view =
            this.props.mode === "d"
                ? Views.DAY
                : this.props.mode === "w"
                ? Views.WEEK
                : this.props.mode === "M"
                ? Views.MONTH
                : null;

        let controlledEvents = this.props.mode === "M" ? [] : this.props.events;

        return (
            <div style={{ width: "100%", height: "100%" }}>
                {this.state.showPopUp ? (
                    <PopUp
                        toggle={this.togglePopUp}
                        event={this.state.eventInPopUp}
                    />
                ) : null}
                <DragAndDropCalendar
                    selectable
                    step={10}
                    dayLayoutAlgorithm="no-overlap"
                    date={this.state.date}
                    components={this.components}
                    localizer={this.state.localizer}
                    view={view}
                    events={controlledEvents}
                    onEventDrop={this.moveEvent}
                    resizable
                    onEventResize={this.resizeEvent}
                    onSelectSlot={this.newEvent}
                    onSelectEvent={(event) => {
                        this.selectEvent(event);
                    }}
                    onDragStart={console.log}
                    defaultView={Views.MONTH}
                    defaultDate={this.state.date}
                    popup={true}
                    dragFromOutsideItem={
                        this.state.displayDragItemInCell
                            ? this.dragFromOutsideItem
                            : null
                    }
                    onDropFromOutside={this.onDropFromOutside}
                    handleDragStart={this.handleDragStart}
                    eventPropGetter={this.eventStyleGetter}
                />
            </div>
        );
    }
}

export default Dnd;
