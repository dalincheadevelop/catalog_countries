import logo from "./logo.svg";
import "./App.css";
import { useEffect, useState } from "react";
import {
  Box,
  Container,
  Dialog,
  DialogContent,
  Grid,
  MenuItem,
  Modal,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";

const apiEndpoint = "https://restcountries.com/v3.1/name/all";
const SHORT_OPTION = [
  { id: 0, label: "Ascending", value: "asc" },
  { id: 1, label: "Descending", value: "desc" },
];

// this function is for filter search and sort data

function applyFilter({ data, filterName, sortOrder }) {
  if (filterName !== null && sortOrder !== null) {
    data = data?.filter(
      (file) =>
        file.name.official.toLowerCase().indexOf(filterName.toLowerCase()) !==
        -1
    );

    data = [...data].sort((a, b) => {
      const nameA = a.name.official.toLowerCase();
      const nameB = b.name.official.toLowerCase();

      if (sortOrder === "asc") {
        return nameA.localeCompare(nameB);
      } else {
        return nameB.localeCompare(nameA);
      }
    });

    return data;
  }
  return data;
}

function App() {
  const [countries, setCountries] = useState([]);
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [filtername, setFilterName] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [dataSelect, setDataSelected] = useState();
  const [open, setOpen] = useState(false);
  const handleOpen = (obj) => {
    setOpen(true);
    setDataSelected(obj);
  };
  const handleClose = () => {
    setOpen(false);
    setDataSelected("");
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  useEffect(() => {
    fetchDataCountries();
  }, [currentPage, sortOrder]);

  const fetchDataCountries = async () => {
    const response = await fetch(`${apiEndpoint}`);
    const data = await response.json();
    setCountries(data);
  };

  const Data = applyFilter({
    data: countries,
    sortOrder,
    filterName: filtername,
  });

  return (
    <Container sx={{ width: "80%", margin: "auto" }}>
      {/* field for filter countries */}
      <Paper sx={{ padding: 2 }}>
        <Typography
          variant="h4"
          sx={{
            display: "flex",
            justifyContent: "center",
            my: 5,
            fontWeight: 800,
          }}
        >
          Catalog Contry
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={6} md={6}>
            <TextField
              value={filtername}
              onChange={(e) => setFilterName(e.target.value)}
              fullWidth
              size="small"
              label="search country name"
            />
          </Grid>
          <Grid item xs={6} md={6}>
            <TextField
              select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              size="small"
              fullWidth
              label="sorting"
            >
              {SHORT_OPTION?.map((obj) => (
                <MenuItem value={obj.value}>{obj.label}</MenuItem>
              ))}
            </TextField>
          </Grid>
        </Grid>
      </Paper>

      {/* display all the contries  */}
      <Paper sx={{ mt: 5 }}>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 700 }} aria-label="customized table">
            <TableHead>
              <TableRow>
                <TableCell align="center">#</TableCell>
                <TableCell align="center">Flag</TableCell>
                <TableCell align="center">Description</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Data?.slice(
                page * rowsPerPage,
                page * rowsPerPage + rowsPerPage
              )?.map((obj, index) => (
                <TableRow key={obj.name}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>
                    <Box component={"img"} src={obj.flags.png} />
                  </TableCell>
                  <TableCell onClick={() => handleOpen(obj)}>
                    <Typography>Name Officail: {obj.name.official}</Typography>
                    <Typography>cca2 : {obj.cca2}</Typography>
                    <Typography>cca3 : {obj.cca3}</Typography>
                    <Typography>
                      Native Country Name :{" "}
                      {Object.keys(obj.name.nativeName).map((langCode) => (
                        <div key={langCode}>
                          <MenuItem>
                            <strong>{langCode.toUpperCase()}:</strong>{" "}
                            {obj.name.nativeName[langCode].common}
                          </MenuItem>
                          <MenuItem>
                            <strong>{langCode.toUpperCase()}:</strong>{" "}
                            {obj.name.nativeName[langCode].official}
                          </MenuItem>
                        </div>
                      ))}
                    </Typography>
                    <Typography>
                      Alternative Country Name:
                      {obj.altSpellings?.map((item) => `${item}, `)}
                    </Typography>
                    <Typography>
                      Country Calling Codes:
                      {obj.idd.root}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          page={page}
          component="div"
          count={Data.length}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          rowsPerPageOptions={[10, 25, 100]}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      {/* pop up dialog for display more information about flag */}
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        maxWidth="lg"
      >
        <DialogContent>
          <Stack
            sx={{
              width: "50%",
              margin: "auto",
            }}
          >
            <Box component={"img"} src={dataSelect?.flags?.png} />
          </Stack>

          <Typography>{JSON.stringify(dataSelect)}</Typography>
        </DialogContent>
      </Dialog>
    </Container>
  );
}

export default App;
