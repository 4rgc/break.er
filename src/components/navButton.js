import "../styles/navButton.css";

const NavButton = (props) => {
    return (
        <div
            className="button-container shadow"
            width={props.width || "auto"}
            height={props.height || "auto"}
            onClick={props.onClick}
        >
            <img
                className="button-icon"
                src={props.selected ? props.selectedIcon : props.icon}
                alt={props.alt}
            />
        </div>
    );
};

export default NavButton;
