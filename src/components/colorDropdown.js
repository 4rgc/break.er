import { useState } from "react";
import { GithubPicker } from "react-color";
import reactCSS from "reactcss";

const ColorDropdown = (props) => {
    //TODO: move colors to a different place for customizability
    let colors = [
        "#B80000",
        "#DB3E00",
        "#FCCB00",
        "#008B02",
        "#006B76",
        "#1273DE",
        "#004DCF",
        "#5300EB",
        "#EB9694",
        "#FAD0C3",
        "#FEF3BD",
        "#C1E1C5",
        "#BEDADC",
        "#C4DEF6",
        "#BED3F3",
        "#D4C4FB",
    ];
    const [selectedColorIndex, setSelectedColorIndex] = useState(0);

    const handleChangeComplete = (color) => {
        const index = colors.findIndex(
            (el) => el.toLowerCase() == color.hex.toLowerCase()
        );
        setSelectedColorIndex(index);
        props.onColorSelected(color.hex);
    };

    const styles = reactCSS({
        default: {
            picker: {
                position: "absolute",
                padding: "4px",
                display: props.showPicker ? "block" : "none",
            },
        },
    });

    return (
        <div>
            <button className="colorSelector" onClick={props.onButtonClicked}>
                <div
                    style={{
                        width: "25px",
                        height: "25px",
                        backgroundColor: colors[selectedColorIndex],
                    }}
                />
            </button>
            <div className="pickerContainer" style={styles.picker}>
                <GithubPicker
                    color={colors[selectedColorIndex]}
                    colors={colors}
                    onChangeComplete={handleChangeComplete}
                />
            </div>
        </div>
    );
};

export default ColorDropdown;
