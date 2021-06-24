import React from "react";
import { ListItem } from "@material-ui/core";
import zIndex from "@material-ui/core/styles/zIndex";

class ChatDisplay extends React.Component {
    render() {
        //const { message, email } = this.props;

        return (
            <ListItem style={styles.listItem}>

                <div style={styles.container}>
                    {this.props.message}

                </div>
            </ListItem>
        );
    }
}

const styles = {
    listItem: {
        flexDirection: "column",
        alignItems: "flex-end",
        zIndex: 20
    },
    container: {
        maxWidth: "75%",
        borderRadius: 12,
        padding: 16,
        color: "white",
        fontSize: 12,
        backgroundColor: "#054740",
        zIndex: 20
    },
    //author: { fontSize: 10, color: "gray" },
    //timestamp: { fontSize: 8, color: "white", textAlign: "right", paddingTop: 4 },
};

export default ChatDisplay;