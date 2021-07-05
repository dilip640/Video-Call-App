import React from "react";
import { ListItem } from "@material-ui/core";


class ChatDisplay extends React.Component {

    render() {

        const isOwnMessage = this.props.chat.id === this.props.local; //to check if message is by local participant

        return (

            <ListItem style={styles.listItem(isOwnMessage)}>

                <div style={styles.author}>
                    {this.props.chat.id}
                </div>

                <div style={styles.container(isOwnMessage)}>
                    {this.props.chat.message}
                </div>

            </ListItem>
        );
    }
}

const styles = {
    listItem: (isOwnMessage) => ({
        flexDirection: "column",
        alignItems: isOwnMessage ? "flex-end" : "flex-start",
    }),
    container: (isOwnMessage) => ({
        maxWidth: "75%",
        borderRadius: 12,
        padding: 16,
        color: "white",
        fontSize: 12,
        backgroundColor: isOwnMessage ? "#054740" : "#262d31",
    }),
    author: { fontSize: 10, color: "gray" },
};

export default ChatDisplay;
