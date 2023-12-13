import React, { useState } from "react";
import { app_style } from "./style";
import Snackbar from "@mui/material/Snackbar";
import CardContent from "@mui/material/CardContent";
import MuiAlert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Paper from "@mui/material/Paper";
import Draggable from "react-draggable";
import api from "./config";
import BarcodeReader from "react-barcode-reader";
import makeStyles from "@mui/styles/makeStyles";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import {
  Box,
  Card,
  TextField,
  Typography,
  AppBar,
  Toolbar,
} from "@mui/material";
import Grid from "@mui/material/Grid";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const useStyles = makeStyles({
  logo: {
    maxWidth: 160,
  },
});

function PaperComponent(props) {
  return (
    <Draggable
      handle="#draggable-dialog-title"
      cancel={'[class*="MuiDialogContent-root"]'}
    >
      <Paper {...props} />
    </Draggable>
  );
}

function App() {
  const classes = useStyles();
  let interval;
  const [scanData1, setScanData1] = useState("");
  const [scanData2, setScanData2] = useState("");
  const [scanTata1, setScanTata1] = useState("");
  const [scanTata2, setScanTata2] = useState("");
  const [scanTata3, setScanTata3] = useState("");
  const [scanTata4, setScanTata4] = useState("");
  const [scanTata5, setScanTata5] = useState("");
  const [scanTata6, setScanTata6] = useState("");
  const [posts, setpost] = useState("");
  const [open, setOpen] = useState(false);
  const [openTata, setOpenTata] = useState(false);
  const [okCount, setokCount] = useState(0);
  const [NokCount, setNokCount] = useState(0);
  const [openError, setOpenError] = useState(false);
  const [displyTata, setdisplyTata] = useState(false);
  const [openErrorExist, setOpenErrorExist] = useState(false);
  const [openErrorAgain, setopenErrorAgain] = useState(false);
  const [openAlert, setOpenAlert] = React.useState(false);
  const [openTataAlert, setOpenTataAlert] = React.useState(false);
  const [openTataExAlert, setOpenTataExAlert] = React.useState(false);
  const [openTataDubAlert, setOpenTataDubAlert] = React.useState(false);
  const [openAlertAgain, setOpenAlertAgain] = React.useState(false);
  let post;
  let scanDatacontn;

  const handleScan = (data) => {
    if (scanData1 === "" && displyTata === false) {
      const length = data.length;
      console.log(length);
      if (length > 15) {
        setScanData1(data.substring(4, 14));
      } else {
        setScanData1(data.substring(1));
      }
    } else if (scanData2 === "") {
      scanDatacontn = data;
      setScanData2(data);
      fetchData();
    }
  };

  const handleScanTata = (data) => {
    if (data !== "" && data !== undefined && displyTata === true) {
      const length = data.length;
      if (length === 32) {
        if (scanTata1 === "") {
          setScanTata1(data);
          setScanTata2(data.substring(0, 14));
          setScanTata3(data.substring(14, 16));
          setScanTata4(data.substring(16, 22));
          setScanTata5(data.substring(22, 26));
          setScanTata6(data.substring(26, 32));
          fetchTataData(data);
        }
      } else {
        setOpenTataAlert(true);
      }
    }
  };

  const resetIcon = () => {
    setScanTata1("");
    setScanTata2("");
    setScanTata3("");
    setScanTata4("");
    setScanTata5("");
    setScanTata6("");
    clearInterval(interval);
  };

  async function fetchTataData(data) {
    const params = data;
    await api
      .post("/getItemCodeforTata?id=" + params, {
        "Content-Type": "text/plain",
      })
      .then((response) => {
        const recordset = response.data.recordset.length;
        if (recordset !== 0) {
          if (recordset === 1) {
            const result = response.data.recordset[0].SerialNo;
            setpost(post);
            console.log(post);
            if (result === params) {
              setOpenTata(true);
              interval = setInterval(() => {
                resetIcon();
              }, 2000);
            }
          } else {
            setOpenTataDubAlert(true);
          }
        } else {
          setOpenTataExAlert(true);
        }
      })
      .catch((error) => {
        if (error) {
          console.log(error);
        }
      });
  }

  async function fetchData() {
    if (scanData1 !== "") {
      const params = scanDatacontn;
      await api
        .post("/getItemCode?id=" + params, {
          "Content-Type": "text/plain",
        })
        .then((response) => {
          if (response.data.recordset.length !== 0) {
            post = response.data.recordset[0].PartnerProductNo;
            if (post !== "") {
              setpost(post);
              console.log(post);
              if (post === scanData1) {
                setOpen(true);
                setScanData2("");
                scanDatacontn = "";
                setokCount(okCount + 1);
              } else {
                setOpenError(true);
                setOpenAlert(true);
                setScanData2("");
                scanDatacontn = "";
                setNokCount(NokCount + 1);
              }
            }
          } else {
            setOpenErrorExist(true);
            setOpenAlertAgain(true);
            setScanData2("");
            scanDatacontn = "";
            setNokCount(NokCount + 1);
          }
        })
        .catch((error) => {
          if (error) {
            console.log(error);
          }
        });
    } else {
      setopenErrorAgain(true);
    }
  }

  const focusinput = (e) => {
    if (e.key === "Enter") {
      setScanData2(e.target.value);
      scanDatacontn = e.target.value;
      fetchData();
    }
  };

  const inputfield = (e) => {
    setScanData2(e.target.value);
    scanDatacontn = e.target.value;
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenError(false);
    setOpen(false);
    setOpenTata(false);
    setOpenErrorExist(false);
    setopenErrorAgain(false);
  };

  const refresicon = () => {
    setScanData2("");
    setScanData1("");
    scanDatacontn = "";
    setOpenError(false);
    setOpen(false);
    setOpenErrorExist(false);
    setopenErrorAgain(false);
    setokCount(0);
    setNokCount(0);
  };

  // useEffect(() => {
  //   fetchData();
  // }, [scanData2]);

  const handleCloseAlert = () => {
    setOpenAlert(false);
    setOpenTataAlert(false);
    setOpenTataExAlert(false);
    setOpenTataDubAlert(false);
    setOpenAlertAgain(false);
  };

  const switchToTata = () => {
    displyTata === false ? setdisplyTata(true) : setdisplyTata(false);
  };

  console.log(displyTata, "djfnsjs");

  const handleError = (err) => console.error(err);

  const sectionStyle = {
    height: displyTata ? "118vh" : "100vh",
    backgroundImage: "url('./barcodebanner.jpg') ",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
  };

  return (
    <Box style={sectionStyle}>
      <AppBar color="inherit">
        <Toolbar>
          <Box
            component="img"
            className={classes.logo}
            alt="BarCodeLogo."
            src="./scanMe.PNG"
          />
          <Grid
            container
            justifyContent="flex-end"
            sx={{ display: displyTata === false ? "flex" : "none" }}
          >
            <Button onClick={switchToTata}>Serial</Button>
          </Grid>
          <Grid
            container
            justifyContent="flex-end"
            sx={{ display: displyTata === false ? "none" : "flex" }}
          >
            <Button onClick={switchToTata}>Back</Button>
          </Grid>
        </Toolbar>
      </AppBar>
      <Box sx={displyTata === false ? app_style.appSx : app_style.appSxN}>
        <Card raised="true" sx={app_style.cardSx}>
          <Typography sx={app_style.cardHeading}>
            Customer Label Validation
          </Typography>
          <CardContent>
            <Box sx={{ mt: 5 }}>
              <BarcodeReader onError={handleError} onScan={handleScan} />

              <Box>
                {" "}
                <TextField
                  id="scanData1"
                  label="Customer Part Number (scan me)"
                  value={scanData1}
                  disabled
                  sx={app_style.inputSx}
                />
              </Box>
              <Box sx={{ mt: 2 }}>
                {" "}
                <TextField
                  id="scanData2"
                  label="Container Number"
                  value={scanData2}
                  onKeyDown={focusinput}
                  onChange={inputfield}
                  sx={app_style.inputSx}
                />
              </Box>
              {/* <Input style={{ padding: "10px", fontSize: "large"  }} value={scanData2} type="text" ></Input> */}
              <Box sx={{ mt: 2 }}>
                <Grid container spacing={1}>
                  <Grid item xs={6}>
                    <Box>
                      {" "}
                      <TextField
                        label="Ok Count"
                        value={okCount}
                        disabled
                        sx={app_style.inputSxs}
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box>
                      {" "}
                      <TextField
                        label="Error Count"
                        value={NokCount}
                        disabled
                        sx={app_style.inputSxs}
                      />
                    </Box>
                  </Grid>
                </Grid>
              </Box>
              <Button sx={{ mt: 3 }}>
                <AutorenewIcon onClick={refresicon} sx={{ padding: "2px" }} />
              </Button>
            </Box>
            <Snackbar open={open} autoHideDuration={7000} onClose={handleClose}>
              <Alert
                onClose={handleClose}
                severity="success"
                sx={{ width: "100%" }}
              >
                Customer Label Sucessfully matched!
              </Alert>
            </Snackbar>
            <Snackbar
              open={openError}
              autoHideDuration={5000}
              onClose={handleClose}
            >
              <Alert
                onClose={handleClose}
                severity="error"
                sx={{ width: "100%" }}
              >
                Customer Label code not matched! -- (<span>{posts}</span>)
              </Alert>
            </Snackbar>
            <Snackbar
              open={openErrorExist}
              autoHideDuration={5000}
              onClose={handleClose}
            >
              <Alert
                onClose={handleClose}
                severity="error"
                sx={{ width: "100%" }}
              >
                Customer Label code not Exist!
              </Alert>
            </Snackbar>
            <Snackbar
              open={openErrorAgain}
              autoHideDuration={3000}
              onClose={handleClose}
            >
              <Alert
                onClose={handleClose}
                severity="error"
                sx={{ width: "100%" }}
              >
                Please Scan Customer Label code again!
              </Alert>
            </Snackbar>
          </CardContent>
        </Card>
        <Box>
          <Dialog
            open={openAlert}
            onClose={handleCloseAlert}
            PaperComponent={PaperComponent}
            aria-labelledby="draggable-dialog-title"
          >
            <DialogTitle style={{ cursor: "move" }} id="draggable-dialog-title">
              <span style={{ color: "red" }}>
                <b>ERROR</b>
              </span>
            </DialogTitle>
            <DialogContent>
              <DialogContentText>
                <b>
                  Customer Label code not matched! -- (<span>{posts}</span>)
                </b>
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button autoFocus onClick={handleCloseAlert}>
                Cancel
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
        <Box>
          <Dialog
            open={openAlertAgain}
            onClose={handleCloseAlert}
            PaperComponent={PaperComponent}
            aria-labelledby="draggable-dialog-title"
          >
            <DialogTitle style={{ cursor: "move" }} id="draggable-dialog-title">
              <span style={{ color: "red" }}>
                <b>ERROR</b>
              </span>
            </DialogTitle>
            <DialogContent>
              <DialogContentText>
                <b>Customer Label code not Exist! Please Scan Again</b>
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button autoFocus onClick={handleCloseAlert}>
                Cancel
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      </Box>
      <Box sx={displyTata === true ? app_style.appSx : app_style.appSxN}>
        <Card raised="true" sx={app_style.cardSxT}>
          <Typography sx={app_style.cardHeading}>
            Serial Number Validation
          </Typography>
          <CardContent>
            <Box sx={{ mt: 2 }}>
              <BarcodeReader onError={handleError} onScan={handleScanTata} />

              <Box>
                {" "}
                <TextField
                  id="scanTata1"
                  label="Barcode (scan me)"
                  value={scanTata1}
                  disabled
                  sx={app_style.inputSxT}
                />
              </Box>
              <Box sx={{ mt: 2 }}>
                {" "}
                <TextField
                  id="scanTata2"
                  label="TML Part No"
                  disabled
                  value={scanTata2}
                  sx={app_style.inputSxT}
                />
              </Box>
              <Box sx={{ mt: 2 }}>
                {" "}
                <TextField
                  id="scanTata3"
                  label="Revision No"
                  disabled
                  value={scanTata3}
                  sx={app_style.inputSxT}
                />
              </Box>
              <Box sx={{ mt: 2 }}>
                {" "}
                <TextField
                  id="scanTata4"
                  label="Vendor Code"
                  disabled
                  value={scanTata4}
                  sx={app_style.inputSxT}
                />
              </Box>
              <Box sx={{ mt: 2 }}>
                {" "}
                <TextField
                  id="scanTata5"
                  label="Month/Year"
                  disabled
                  value={scanTata5}
                  sx={app_style.inputSxT}
                />
              </Box>
              <Box sx={{ mt: 2 }}>
                {" "}
                <TextField
                  id="scanTata6"
                  label="Serial No"
                  disabled
                  value={scanTata6}
                  sx={app_style.inputSxT}
                />
              </Box>
              <Button sx={{ mt: 3, padding: "2px" }} onClick={resetIcon}>
                Reset
              </Button>
            </Box>
            <Snackbar
              open={openTata}
              autoHideDuration={7000}
              onClose={handleClose}
            >
              <Alert
                onClose={handleClose}
                severity="success"
                sx={{ width: "100%" }}
              >
                Barcode Sucessfully matched!
              </Alert>
            </Snackbar>
          </CardContent>
        </Card>
        <Box>
          <Dialog
            open={openTataAlert}
            onClose={handleCloseAlert}
            PaperComponent={PaperComponent}
            aria-labelledby="draggable-dialog-title"
          >
            <DialogTitle style={{ cursor: "move" }} id="draggable-dialog-title">
              <span style={{ color: "red" }}>
                <b>ERROR</b>
              </span>
            </DialogTitle>
            <DialogContent>
              <DialogContentText>
                <b>
                  Barcode not matched! -- (<span>{scanTata1}</span>)
                </b>
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button autoFocus onClick={handleCloseAlert}>
                Cancel
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
        <Box>
          <Dialog
            open={openTataExAlert}
            onClose={handleCloseAlert}
            PaperComponent={PaperComponent}
            aria-labelledby="draggable-dialog-title"
          >
            <DialogTitle style={{ cursor: "move" }} id="draggable-dialog-title">
              <span style={{ color: "red" }}>
                <b>ERROR</b>
              </span>
            </DialogTitle>
            <DialogContent>
              <DialogContentText>
                <b>
                  Barcode not Exist! -- (<span>{scanTata1}</span>)
                </b>
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button autoFocus onClick={handleCloseAlert}>
                Cancel
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
        <Box>
          <Dialog
            open={openTataDubAlert}
            onClose={handleCloseAlert}
            PaperComponent={PaperComponent}
            aria-labelledby="draggable-dialog-title"
          >
            <DialogTitle style={{ cursor: "move" }} id="draggable-dialog-title">
              <span style={{ color: "red" }}>
                <b>ERROR</b>
              </span>
            </DialogTitle>
            <DialogContent>
              <DialogContentText>
                <b>
                  Duplicate Barcode! -- (<span>{scanTata1}</span>)
                </b>
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button autoFocus onClick={handleCloseAlert}>
                Cancel
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      </Box>
    </Box>
  );
}

export default App;
