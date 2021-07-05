import React, { useState, useEffect } from 'react';
import './index.css';
import App from './App';
import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import ButtonBase from '@material-ui/core/ButtonBase';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import Dialog from "@material-ui/core/Dialog";

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
            flexWrap: 'wrap',
            minWidth: 300,
            width: '100%',
            marginTop: theme.spacing(25),
            '& > *': {
                marginTop: theme.spacing(1),
                marginBottom: theme.spacing(2),
                marginLeft: theme.spacing(45),
            },
        },
        image: {
            position: 'relative',
            height: 125,
            [theme.breakpoints.down('xs')]: {
                width: '100% !important', // Overrides inline-style
                height: 100,
            },
            '&:hover, &$focusVisible': {
                zIndex: 1,
                '& $imageBackdrop': {
                    opacity: 0.15,
                },
                '& $imageMarked': {
                    opacity: 0,
                },
                '& $imageTitle': {
                    border: '4px solid currentColor',
                },
            },
        },
        focusVisible: {},
        imageButton: {
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: theme.palette.common.white,
        },
        imageSrc: {
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            backgroundSize: 'cover',
            backgroundPosition: 'center 40%',
        },
        imageBackdrop: {
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            backgroundColor: theme.palette.common.black,
            opacity: 0.4,
            transition: theme.transitions.create('opacity'),
        },
        imageTitle: {
            position: 'relative',
            padding: `${theme.spacing(2)}px ${theme.spacing(4)}px ${theme.spacing(1) + 6}px`,
        },
        imageMarked: {
            height: 3,
            width: 18,
            backgroundColor: theme.palette.common.white,
            position: 'absolute',
            bottom: -2,
            left: 'calc(50% - 9px)',
            transition: theme.transitions.create('opacity'),
        }
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
    const [authError, setauthError] = useState('');
    const [regError, setregError] = useState('');
    const [openLogin, setOpenLogin] = useState(false);
    const [openSignup, setOpenSignup] = useState(false);
    const [isLoading, setLoading] = useState(false);


    const auth = async (e) => { //function for login into the app
        try {
            e.preventDefault();
            setLoading(true);
            const res = await axios.post('http://localhost:4000/api/login', { email: email, password: password }, { withCredentials: true });
            if (res.data.isAuth === true || res.data.error === true) {
                console.log(res.data);
                const res1 = await axios.get('http://localhost:4000/api/profile', { withCredentials: true });
                setIdentity(res1.data.name);
                setScreen(res.data.isAuth);
                setauthError('');
                setOpenLogin(false);
            }
            else if (res.data.isAuth === false) {
                setauthError(res.data.message);
                setLoading(false);
            }
        } catch (e) {
            console.log(e);
        }
    };

    const reg = async (e) => { //function for new sign up
        try {
            e.preventDefault();
            setLoading(true);
            const res = await axios.post('http://localhost:4000/api/register', { firstname: newfname, lastname: newlname, email: newemail, password: newpassword, password2: newpassword2 }, { withCredentials: true });
            if (res.data.success === true) {
                const res1 = await axios.post('http://localhost:4000/api/login', { email: newemail, password: newpassword }, { withCredentials: true });
                const res2 = await axios.get('http://localhost:4000/api/profile', { withCredentials: true });
                setIdentity(res2.data.name);
                setScreen(res1.data.isAuth);
                setregError('');
                setOpenSignup(false);
            }
            else if (res.data.success === false) {
                setregError("Failed! Try again!");
                setLoading(false);
            }
            else if (res.data.auth === false) {
                setregError(res.data.message);
                setLoading(false);
            }
        } catch (e) {
            console.log(e);
        }
    };

    const deleteCookie = async (e) => { //function to logout and delete cookies
        try {
            e.preventDefault();
            console.log("logout");
            await axios.get('http://localhost:4000/api/logout', { withCredentials: true });
            setScreen(false);
            setLoading(false);
        } catch (e) {
            console.log(e);
        }
    };

    const readCookie = async () => { //function to read cookies
        try {
            const res = await axios.get('http://localhost:4000/api/profile', { withCredentials: true });
            console.log("cook");
            console.log(screen);
            //setScreen(res.data.isAuth);
            if (res.data.isAuth === true) {
                setScreen(res.data.isAuth);
                console.log(screen);
                setIdentity(res.data.name);
                console.log(identity);
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
                        <ButtonBase
                            focusRipple
                            key='Signup'
                            className={classes.image}
                            focusVisibleClassName={classes.focusVisible}
                            style={{
                                width: "55%",
                            }}
                            onClick={() => setOpenSignup(true)}
                        >

                            <span
                                className={classes.imageSrc}
                                style={{
                                    backgroundColor: '#008B8B'
                                }}
                            />

                            <span className={classes.imageBackdrop} />

                            <span className={classes.imageButton}>
                                <Typography
                                    component="span"
                                    variant="h5"
                                    color="inherit"
                                    className={classes.imageTitle}
                                >
                                    Donot have an account? Sign up here
                                    <span className={classes.imageMarked} />
                                </Typography>
                            </span>

                        </ButtonBase>

                        <ButtonBase
                            focusRipple
                            key='Login'
                            className={classes.image}
                            focusVisibleClassName={classes.focusVisible}
                            style={{
                                width: "55%",
                            }}
                            onClick={() => setOpenLogin(true)}
                        >

                            <span
                                className={classes.imageSrc}
                                style={{
                                    backgroundColor: '#008B8B',
                                }}
                            />

                            <span className={classes.imageBackdrop} />

                            <span className={classes.imageButton}>
                                <Typography
                                    component="span"
                                    variant="h5"
                                    color="inherit"
                                    className={classes.imageTitle}
                                >
                                    Already have an account? Log in here
                                    <span className={classes.imageMarked} />
                                </Typography>
                            </span>

                        </ButtonBase>

                        <Dialog
                            open={openSignup}
                            onClose={() => setOpenSignup(false)}
                            aria-labelledby="alert-dialog-title"
                            aria-describedby="alert-dialog-description"
                        >
                            <Grid container
                                spacing={0}
                                direction="column"
                                alignItems="center"
                                justify="center"
                            >
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
                                                {regError === '' ?
                                                    <div>
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
                                                                    type="password"
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
                                                        >
                                                            Sign Up
                                                        </Button>

                                                        {(isLoading === true) ? <div className="progress">Connecting</div> : <div></div>}

                                                    </div>
                                                    :
                                                    <div>
                                                        <Grid container spacing={2}>

                                                            <Grid item xs={12} sm={6}>
                                                                <TextField
                                                                    error
                                                                    id="outlined-error-helper-text"
                                                                    autoComplete="fname"
                                                                    name="firstName"
                                                                    variant="outlined"
                                                                    required
                                                                    fullWidth
                                                                    label="First Name"
                                                                    autoFocus
                                                                    onChange={e => setnewFname(e.target.value)}
                                                                />
                                                            </Grid>

                                                            <Grid item xs={12} sm={6}>
                                                                <TextField
                                                                    error
                                                                    id="outlined-error-helper-text"
                                                                    variant="outlined"
                                                                    required
                                                                    fullWidth
                                                                    label="Last Name"
                                                                    name="lastName"
                                                                    autoComplete="lname"
                                                                    onChange={e => setnewLname(e.target.value)}
                                                                />
                                                            </Grid>

                                                            <Grid item xs={12}>
                                                                <TextField
                                                                    error
                                                                    id="outlined-error-helper-text"
                                                                    variant="outlined"
                                                                    required
                                                                    fullWidth
                                                                    label="Email Address"
                                                                    name="email"
                                                                    autoComplete="email"
                                                                    onChange={e => setnewEmail(e.target.value)}
                                                                />
                                                            </Grid>

                                                            <Grid item xs={12}>
                                                                <TextField
                                                                    error
                                                                    id="outlined-error-helper-text"
                                                                    variant="outlined"
                                                                    required
                                                                    fullWidth
                                                                    name="password"
                                                                    label="Password"
                                                                    type="password"
                                                                    autoComplete="current-password"
                                                                    onChange={e => setnewPassword(e.target.value)}
                                                                />
                                                            </Grid>

                                                            <Grid item xs={12}>
                                                                <TextField
                                                                    error
                                                                    id="outlined-error-helper-text"
                                                                    variant="outlined"
                                                                    required
                                                                    fullWidth
                                                                    name="confirm password"
                                                                    label="Confirm Password"
                                                                    type="password"
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
                                                        >
                                                            Sign Up
                                                        </Button>

                                                        {(isLoading === true) ? <div className="progress">Connecting</div> : <div></div>}

                                                        <Typography variant="subtitle2" style={{ color: "red" }}>
                                                            {regError}
                                                        </Typography>

                                                    </div>
                                                }
                                            </form>
                                        </div>
                                    </Container>
                                </Paper>
                            </Grid>
                        </Dialog>

                        <Dialog
                            open={openLogin}
                            onClose={() => setOpenLogin(false)}
                            aria-labelledby="alert-dialog-title"
                            aria-describedby="alert-dialog-description"
                        >
                            <Grid container
                                spacing={0}
                                direction="column"
                                alignItems="center"
                                justify="center"
                            >
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
                                                {authError === '' ?
                                                    <div>

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

                                                        {(isLoading === true) ? <div className="progress">Connecting</div> : <div></div>}


                                                    </div>
                                                    :
                                                    <div>

                                                        <TextField
                                                            error
                                                            id="outlined-error-helper-text"
                                                            variant="outlined"
                                                            margin="normal"
                                                            required
                                                            fullWidth
                                                            label="Email Address"
                                                            name="email"
                                                            autoFocus
                                                            onChange={e => setEmail(e.target.value)}
                                                        />

                                                        <TextField
                                                            error
                                                            id="outlined-error-helper-text"
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

                                                        {(isLoading === true) ? <div className="progress">Connecting</div> : <div></div>}

                                                        <Typography variant="subtitle2" style={{ color: "red" }}>
                                                            {authError}
                                                        </Typography>

                                                    </div>
                                                }
                                            </form>
                                        </div>
                                        <Box mt={8}>
                                        </Box>
                                    </Container>
                                </Paper>
                            </Grid>
                        </Dialog>
                    </div>

                    : <App logout={deleteCookie} identity={identity} />
            }
        </div >
    );

}

export default Auth;

