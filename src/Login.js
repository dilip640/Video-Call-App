import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import axios from 'axios';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';



function Auth() {
    const useStyles = makeStyles((theme) => ({
        paper: {
            marginTop: theme.spacing(5),
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',

        },
        avatar: {
            margin: theme.spacing(1),
            backgroundColor: theme.palette.primary.main,
        },
        form: {
            width: '100%',
            marginTop: theme.spacing(1),
        },
        submit: {
            margin: theme.spacing(3, 0, 2),
        },
        root: {
            display: 'flex',

            '& > *': {
                marginTop: theme.spacing(10),
                //width: theme.spacing(160),
                //height: theme.spacing(160),

            },


        },
    }));


    const classes = useStyles();
    const [newemail, setnewEmail] = useState();
    const [newpassword, setnewPassword] = useState();
    const [newpassword2, setnewPassword2] = useState();
    const [newfname, setnewFname] = useState();
    const [newlname, setnewLname] = useState();
    const [screen, setScreen] = useState(false);
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [identity, setIdentity] = useState('');


    const auth = async (e) => {
        try {
            e.preventDefault();
            const res = await axios.post('http://localhost:4000/api/login', { email: email, password: password }, { withCredentials: true });
            console.log("auth");

            //setScreen(res.data.isAuth);
            //console.log(screen);
            if (res.data.isAuth === true) {
                console.log(res.data);
                const res1 = await axios.get('http://localhost:4000/api/profile', { withCredentials: true });
                setIdentity(res1.data.name);
                console.log(identity);
                //console.log(res1.data.name);
                setScreen(res.data.isAuth);
                console.log(screen);

            }
            else if (res.data.isAuth === false) {
                console.log(res.data.message);


            }
        } catch (e) {
            console.log(e);
        }
    };

    const reg = async (e) => {
        try {
            e.preventDefault();
            const res = await axios.post('http://localhost:4000/api/register', { firstname: newfname, lastname: newlname, email: newemail, password: newpassword, password2: newpassword2 }, { withCredentials: true });
            //console.log(res.data);
            console.log("reg");
            console.log(res.data);
            const res1 = await axios.post('http://localhost:4000/api/login', { email: newemail, password: newpassword }, { withCredentials: true });
            console.log("authii");
            const res2 = await axios.get('http://localhost:4000/api/profile', { withCredentials: true });
            setIdentity(res2.data.name);
            setScreen(res1.data.isAuth);
        } catch (e) {
            console.log(e);
        }
    };

    const deleteCookie = async (e) => {
        try {
            e.preventDefault();
            console.log("logout");
            await axios.get('http://localhost:4000/api/logout', { withCredentials: true });
            setScreen(false);
        } catch (e) {
            console.log(e);
        }
    };

    const readCookie = async () => {
        try {
            const res = await axios.get('http://localhost:4000/api/profile', { withCredentials: true });
            console.log("cook");
            console.log(screen);
            //setScreen(res.data.isAuth);
            if (res.data.isAuth === true) {
                setIdentity(res.name);
                console.log(res.data);

            }
        } catch (e) {
            setScreen(false);
            console.log(e);
        }
    };

    useEffect(() => {
        readCookie();
    }, []);

    return (
        <div className="App">
            {
                (screen === false)
                    ? <div className={classes.root}>
                        <Grid container
                            spacing={0}
                            direction="column"
                            alignItems="center"
                            justify="center">
                            <Paper elevation={3} >
                                <Container component="main" maxWidth="xs">
                                    <CssBaseline />
                                    <div className={classes.paper}>
                                        <Typography variant="h6">
                                            Do not have an account? create here
                                        </Typography>
                                        <Avatar className={classes.avatar}>
                                            <LockOutlinedIcon />
                                        </Avatar>
                                        <Typography component="h1" variant="h5">
                                            Sign up
                                        </Typography>
                                        <form className={classes.form} noValidate>
                                            <Grid container spacing={2}>
                                                <Grid item xs={12} sm={6}>
                                                    <TextField
                                                        autoComplete="fname"
                                                        name="firstName"
                                                        variant="outlined"
                                                        required
                                                        fullWidth
                                                        id="firstName"
                                                        label="First Name"
                                                        autoFocus
                                                        onChange={e => setnewFname(e.target.value)}
                                                    />
                                                </Grid>
                                                <Grid item xs={12} sm={6}>
                                                    <TextField
                                                        variant="outlined"
                                                        required
                                                        fullWidth
                                                        id="lastName"
                                                        label="Last Name"
                                                        name="lastName"
                                                        autoComplete="lname"
                                                        onChange={e => setnewLname(e.target.value)}
                                                    />
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <TextField
                                                        variant="outlined"
                                                        required
                                                        fullWidth
                                                        id="email"
                                                        label="Email Address"
                                                        name="email"
                                                        autoComplete="email"
                                                        onChange={e => setnewEmail(e.target.value)}
                                                    />
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <TextField
                                                        variant="outlined"
                                                        required
                                                        fullWidth
                                                        name="password"
                                                        label="Password"
                                                        type="password"
                                                        id="password"
                                                        autoComplete="current-password"
                                                        onChange={e => setnewPassword(e.target.value)}
                                                    />
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <TextField
                                                        variant="outlined"
                                                        required
                                                        fullWidth
                                                        name="confirm password"
                                                        label="Confirm Password"
                                                        type="confirm password"
                                                        id="confirm password"
                                                        autoComplete="current-password"
                                                        onChange={e => setnewPassword2(e.target.value)}
                                                    />
                                                </Grid>
                                            </Grid>
                                            <Button
                                                type="submit"
                                                fullWidth
                                                variant="contained"
                                                color="primary"
                                                className={classes.submit}
                                                onClick={e => reg(e)}
                                            // onClick={deleteCookie}
                                            >
                                                Sign Up
                                            </Button>
                                        </form>
                                    </div>
                                </Container>
                            </Paper>
                        </Grid>
                        <Divider orientation="vertical" flexItem />
                        <Grid container
                            spacing={0}
                            direction="column"
                            alignItems="center"
                            justify="center">
                            <Paper elevation={3} >
                                <Container component="main" maxWidth="xs">
                                    <CssBaseline />
                                    <div className={classes.paper}>
                                        <Typography variant="h6">
                                            Already have an account?
                                        </Typography>
                                        <Avatar className={classes.avatar}>
                                            <LockOutlinedIcon />
                                        </Avatar>
                                        <Typography component="h1" variant="h5">
                                            Sign in
                                        </Typography>
                                        <form className={classes.form} noValidate>
                                            <TextField
                                                variant="outlined"
                                                margin="normal"
                                                required
                                                fullWidth
                                                id="email"
                                                label="Email Address"
                                                name="email"
                                                autoFocus
                                                onChange={e => setEmail(e.target.value)}
                                            />
                                            <TextField
                                                variant="outlined"
                                                margin="normal"
                                                required
                                                fullWidth
                                                name="password"
                                                label="Password"
                                                type="password"
                                                id="password"
                                                onChange={e => setPassword(e.target.value)}
                                            />
                                            <Button
                                                type="submit"
                                                fullWidth
                                                variant="contained"
                                                color="primary"
                                                className={classes.submit}
                                                onClick={e => auth(e)}
                                            >
                                                Sign In
                                            </Button>
                                        </form>
                                    </div>
                                    <Box mt={8}>
                                    </Box>
                                </Container>
                            </Paper>
                        </Grid>
                    </div>
                    : <App logout={deleteCookie} identity={identity} />

            }
        </div>
    );
}

export default Auth;

