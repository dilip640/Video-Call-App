import './App.css'
import React, { Component } from 'react'
import {
    CssBaseline,
    Grid,
    IconButton,
    TextField,
} from "@material-ui/core";
import { Send } from "@material-ui/icons";
import InputAdornment from "@material-ui/core/InputAdornment";
import ChatDisplay from './ChatDisplay';


class ChatBox extends Component {
    constructor(props) {
        super(props);

        this.state = {
            message: ''  //Updated whenever a message is typed
        }

        this.changeMessage = this.changeMessage.bind(this); //Change the message state

    }

    changeMessage(event) {
        this.setState({
            message: event.target.value
        });
    }

    componentDidMount() {
        this.scrollToBottom();
    }

    componentDidUpdate() {
        this.scrollToBottom();
    }

    scrollToBottom() { //to always keep chatbox scrolled at bottom
        this.el.scrollIntoView({ behavior: 'smooth' });
    }


    render() {
        return (

            <div className="chatbox" style={styles.chat}>

                <div>
                    {
                        this.props.chat.map(chat => <ChatDisplay chat={chat} local={this.props.local} />)
                    }
                </div>

                <div ref={el => { this.el = el; }} />
                <CssBaseline />

                <div className="spacer"> . </div>

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
                                onChange={this.changeMessage}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment>
                                            <IconButton
                                                style={styles.sendButton}
                                                onClick={() => { this.props.sendMessage(this.state.message); this.setState({ message: "" }) }}>
                                                <Send style={styles.sendIcon} />
                                            </IconButton>
                                        </InputAdornment>
                                    )
                                }} />

                        </Grid>
                    </Grid>
                </Grid>
            </div>

        );
    }
}

const styles = {
    textField: { width: "47%", borderWidth: 0, borderColor: "transparent" },
    textFieldContainer: { flex: 1, /*marginRight: 12*/ },
    gridItemMessage: { height: 90, marginTop: 12, marginBottom: 0, position: "fixed", bottom: 0, width: "47%", zIndex: 60, backgroundColor: "white" },
    sendButton: { backgroundColor: "#3f51b5" },
    sendIcon: { color: "white" },
    chat: { marginBottom: 92 }
};

export default ChatBox;