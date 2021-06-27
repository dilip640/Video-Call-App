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
import { ConsoleWriter } from 'istanbul-lib-report';
import ChatDisplay from './ChatDisplay';


class ChatBox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            message: ''
        }
        //console.log(this.props.id.identity);

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
                        this.props.messages.map(message => <ChatDisplay message={message} />)
                    }
                </div>
                <CssBaseline />
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

                            />
                            <IconButton
                                style={styles.sendButton}
                                onClick={() => { this.props.sendMessage(this.state.message) }}>
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
    textFieldContainer: { flex: 1, marginRight: 12 },
    gridItem: { paddingTop: 12, paddingBottom: 12 },
    gridItemChatList: { overflow: "auto", height: "70vh" },
    gridItemMessage: { marginTop: 12, marginBottom: 12 },
    sendButton: { backgroundColor: "#3f51b5" },
    sendIcon: { color: "white" },
    mainGrid: { paddingTop: 100, borderWidth: 1 },
};

export default ChatBox;

/*import React, { Component } from 'react';
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
//import axios from "axios";
import ChatItem from "./ChatItem";
import './App.css';
const Chat = require("twilio-chat");

class ChatBox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            text: "",
            messages: [],
            loading: false,
            channel: null,
        };

        this.scrollDiv = React.createRef();
    }

    joinChannel = async (channel) => {
        //console.log("joinChannelstart");
        if (channel.channelState.status !== "joined") {
            await channel.join();
        }

        this.setState({
            channel: channel,
            loading: false
        });

        channel.on("messageAdded", this.handleMessageAdded);
        this.scrollToBottom();
        //console.log("joinChannelend");
    };

    handleMessageAdded = (message) => {
        //console.log("handlemessagestart");
        const { messages } = this.state;
        this.setState({
            messages: [...messages, message],
        },
            this.scrollToBottom
        );
    };

    scrollToBottom = () => {
        console.log("scrollto bottomstart");
        const scrollHeight = this.scrollDiv.current.scrollHeight;
        const height = this.scrollDiv.current.clientHeight;
        const maxScrollTop = scrollHeight - height;
        this.scrollDiv.current.scrollTop = maxScrollTop > 0 ? maxScrollTop : 0;
        console.log("scbe");
    };


    componentDidMount = async () => {
        //console.log("component did mount start");
        let token = "";
        this.setState({ loading: true });

        try {
            token = this.props.token;
        } catch {
            throw new Error("Unable to get token, please reload this page");
        }

        const client = await Chat.Client.create(token);

        client.on("tokenAboutToExpire", async () => {
            const token = this.props.token;
            client.updateToken(token);
        });

        client.on("tokenExpired", async () => {
            const token = await this.props.token;
            client.updateToken(token);
        });


        client.on("channelJoined", async (channel) => {
            // getting list of all messages since this is an existing channel
            const messages = await channel.getMessages();
            this.setState({ messages: messages.items || [] });
            this.scrollToBottom();
        });

        try {
            console.log(this.props.room.name);
            const channel = await client.getChannelByUniqueName(this.props.room.name);
            this.joinChannel(channel);
        } catch (err) {
            try {
                const channel = await client.createChannel({
                    uniqueName: this.props.room.name,
                    friendlyName: this.props.room.name,
                });

                this.joinChannel(channel);
            } catch {
                throw new Error("Unable to create channel, please reload this page");
            }
        }
        //console.log("end");
    }

    sendMessage = () => {
        //console.log("sms");
        const { text, channel } = this.state;
        if (text) {
            this.setState({ loading: true });
            channel.sendMessage(String(text).trim());
            this.setState({ text: "", loading: false });
        }
        //console.log("sme");
    };


    render() {
        const { loading, text, messages, channel } = this.state;

        return (
            <Container component="main" maxWidth="md">
                <Backdrop open={loading} style={{ zIndex: 99999 }}>
                    <CircularProgress style={{ color: "white" }} />
                </Backdrop>


                <CssBaseline />

                <Grid container direction="column" style={styles.mainGrid}>
                    <Grid item style={styles.gridItemChatList} ref={this.scrollDiv}>
                        <List dense={true}>
                            {messages &&
                                messages.map((message) =>
                                    <ChatItem
                                        key={message.index}
                                        message={message}
                                        identity={this.props.identity} />
                                )}
                        </List>
                    </Grid>

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
                                    value={text}
                                    //disabled={!channel}
                                    onChange={(event) =>
                                        this.setState({ text: event.target.value, channel: "joined" })
                                    } />
                            </Grid>

                            <Grid item>
                                <IconButton
                                    style={styles.sendButton}
                                    onClick={this.sendMessage}
                                    //disabled={!channel}/>
                                    <Send style={styles.sendIcon} />
                                </IconButton>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Container>
        );
    }
}

const styles = {
    textField: { width: "100%", borderWidth: 0, borderColor: "transparent" },
    textFieldContainer: { flex: 1, marginRight: 12 },
    gridItem: { paddingTop: 12, paddingBottom: 12 },
    gridItemChatList: { overflow: "auto", height: "70vh" },
    gridItemMessage: { marginTop: 12, marginBottom: 12 },
    sendButton: { backgroundColor: "#3f51b5" },
    sendIcon: { color: "white" },
    mainGrid: { paddingTop: 100, borderWidth: 1 },
};


export default ChatBox;*/