import "../styles/breakItButton.css";

const BreakItButton = (props) => {
    return (
        <span onClick={props.onClick} className="breakItButton">
            break it
        </span>
    );
};

export default BreakItButton;
