import React from "react";
import Head from "next/head";
import Nav from "../components/nav";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import Button from "@material-ui/core/Button";
import NextLink from "next/link";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import TextField from "@material-ui/core/TextField";
import Router from "next/router";

function NewAnalysisDialog({ handleClose, open }) {
  const [name, setName] = React.useState("");
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const create = ev => {
    handleClose();
    Router.push({
      pathname: "/record",
      query: { name }
    });
  };

  return (
    <Dialog
      fullScreen={fullScreen}
      open={open}
      onClose={handleClose}
      aria-labelledby="responsive-dialog-title"
    >
      <DialogTitle id="responsive-dialog-title">
        {"Create new analysis"}
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          Name your analysis so that you can find it later
        </DialogContentText>
        <TextField
          value={name}
          onChange={e => setName(e.target.value)}
          name="name"
          helperText="Name"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button onClick={create} color="primary" autoFocus>
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function NewAnalysisCard() {
  const [open, setOpen] = React.useState(false);

  function handleClickOpen() {
    setOpen(true);
  }

  function handleClose() {
    setOpen(false);
  }

  return (
    <Card>
      <h3>Create a new analysis</h3>
      <Button onClick={handleClickOpen}>New Analysis</Button>
      <NewAnalysisDialog handleClose={handleClose} open={open} />
    </Card>
  );
}

const Home = () => (
  <div>
    <Head>
      <title>Home</title>
    </Head>
    <Nav />
    <Grid container>
      <NewAnalysisCard />
    </Grid>
  </div>
);

export default Home;
