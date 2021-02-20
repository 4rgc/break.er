import { useState } from "react";
import "../styles/popUp.css";
import ColorDropdown from "./colorDropdown";
import moment from "moment";

const PopUp = (props) => {
    const [showColorPicker, setShowColorPicker] = useState(false);
    const [calEvent, setCalEvent] = useState(props.event);
    const handleClick = () => props.toggle();
    const onTitleChange = (event) => {
        let newTitle = event.target.value;
        setCalEvent({ ...calEvent, title: newTitle });
        props.event.title = newTitle;
    };
    const onColorChange = (hexColor) => {
        setCalEvent({ ...calEvent, color: hexColor });
        props.event.color = hexColor;
    };
    const onStartTimeChange = (event) => {
        let newStartTime = event.target.value;

        let prevDateTime = moment(calEvent.start).format("L");
        let newDateTimeString = prevDateTime + " " + newStartTime;

        let newStartDateTime = moment(newDateTimeString).toDate();

        setCalEvent({ ...calEvent, start: newStartDateTime });
        props.event.start = newStartDateTime;
    };
    const onEndTimeChange = (event) => {
        let newEndTime = event.target.value;

        let prevDateTime = moment(calEvent.end).format("L");
        let newDateTimeString = prevDateTime + " " + newEndTime;
        let newEndDateTime = moment(newDateTimeString).toDate();

        setCalEvent({ ...calEvent, end: newEndDateTime });
        props.event.end = newEndDateTime;
    };
    const onIsBreakableChange = (event) => {
        let newIsBreakable = event.target.checked;
        setCalEvent({ ...calEvent, isBreakable: newIsBreakable });
        props.event.isBreakable = newIsBreakable;
    };
    const onIsABreakChange = (event) => {
        let newIsABreak = event.target.checked;
        setCalEvent({ ...calEvent, isABreak: newIsABreak });
        props.event.isABreak = newIsABreak;
    };

    console.log(calEvent.start.toLocaleTimeString());
    console.log(calEvent.end.toLocaleTimeString());

    return (
        <div className="modal" onClick={handleClick}>
            <div
                className="gridContainer"
                onClick={(event) => {
                    setShowColorPicker(false);
                    event.stopPropagation();
                }}
            >
                <div className="modalContent">
                    <div class="closeContainer">
                        <span className="close" onClick={handleClick}>
                            &times;
                        </span>
                    </div>
                    <div className="eventTitleContainer">
                        <input
                            className="titleInput"
                            value={calEvent.title}
                            placeholder="Event title"
                            onChange={onTitleChange}
                        />
                        <div style={{ width: "40px" }} />
                        <div onClick={(event) => event.stopPropagation()}>
                            <ColorDropdown
                                showPicker={showColorPicker}
                                onColorSelected={(hexColor) => {
                                    onColorChange(hexColor);
                                    setShowColorPicker(false);
                                }}
                                onButtonClicked={() =>
                                    setShowColorPicker(!showColorPicker)
                                }
                            />
                        </div>
                    </div>
                    <div className="startTimeContainer">
                        <span>Start time</span>
                        <input
                            className="time"
                            name="startTime"
                            type="time"
                            value={moment(calEvent.start).format("HH:mm:ss")}
                            onChange={onStartTimeChange}
                            //defaultValue={props.startTime}
                        />
                    </div>
                    <div className="endTimeContainer">
                        <span>End time</span>
                        <input
                            className="time"
                            name="endTime"
                            type="time"
                            value={moment(calEvent.end).format("HH:mm:ss")}
                            onChange={onEndTimeChange}
                            //defaultValue={props.endTime}
                        />
                    </div>
                    <div className="breakableContainer">
                        <div style={{ width: "50px" }} />
                        <input
                            type="checkbox"
                            name="breakable"
                            defaultChecked={calEvent.isBreakable}
                            onChange={onIsBreakableChange}
                        />
                        <div style={{ width: "20px" }} />
                        <span>Event is breakable</span>
                    </div>
                    <div className="isABreakContainer">
                        <div style={{ width: "50px" }} />
                        <input
                            type="checkbox"
                            name="isABreak"
                            defaultChecked={calEvent.isABreak}
                            onChange={onIsABreakChange}
                        />
                        <div style={{ width: "20px" }} />
                        <span>Count event as a break</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PopUp;
