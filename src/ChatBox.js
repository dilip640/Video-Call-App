import './App.css'
import React, { Component } from 'react'
import {
    AppBar,
    Backdrop,
    CircularProgress,
    Container,
    CssBaseline,
    Grid,
    IconButton,
    List,
    TextField,
    Toolbar,
    Typography,
} from "@material-ui/core";
import { Send } from "@material-ui/icons";
import ChatDisplay from './ChatDisplay';


class ChatBox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            message: ''
        }
        this.changeMessage = this.changeMessage.bind(this);
    }

    changeMessage(event) {
        this.setState({
            message: event.target.value
        });

    }

    render() {
        return (
            <div className="chatbox">
                <div>
                    {
                        this.props.chat.map(chat => <ChatDisplay chat={chat} local={this.props.local} />)
                    }
                </div>
                <CssBaseline />
                <div class="spacer"> . </div>
                <Grid item style={styles.gridItemMessage}>
                    <Grid
                        container
                        direction="row"
                        justify="center"
                        alignItems="center">
                        <Grid item style={styles.textFieldContainer}>
                            <TextField
                                required
                                style={styles.textField}
                                placeholder="Enter message"
                                variant="outlined"
                                multiline
                                rows={2}
                                value={this.state.message}
                                onChange={this.changeMessage} />
                            <IconButton
                                style={styles.sendButton}
                                onClick={() => { this.props.sendMessage(this.state.message); this.setState({ message: "" }) }}>
                                <Send style={styles.sendIcon} />
                            </IconButton>
                        </Grid>
                    </Grid>
                </Grid>
            </div>
        );
    }
}

const styles = {
    textField: { width: "100%", borderWidth: 0, borderColor: "transparent" },
    textFieldContainer: { flex: 1, /*marginRight: 12*/ },
    gridItem: { paddingTop: 12, paddingBottom: 12 },
    gridItemChatList: { overflow: "auto", height: "70vh" },
    gridItemMessage: { height: 110, marginTop: 12, marginBottom: 12, position: "fixed", bottom: 0, width: "100%", zIndex: 60, backgroundColor: "white" },
    sendButton: { backgroundColor: "#3f51b5" },
    sendIcon: { color: "white" },
    mainGrid: { paddingTop: 100, borderWidth: 1 },
};

export default ChatBox;