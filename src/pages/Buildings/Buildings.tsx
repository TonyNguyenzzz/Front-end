// src/pages/Buildings/Buildings.tsx
import React, { useState, useMemo } from 'react';
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  TableContainer,
  Paper,
  TablePagination,
  InputAdornment,
  IconButton,
  MenuItem,
  Snackbar,
  Alert,
  Grid,
  Card,
  CardContent,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import buildingsData from '../../data/buildingsData';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import ConfirmDeleteDialog from '../../components/ConfirmDeleteDialog';

interface Building {
  id: number;
  name: string;
  address: string;
  floors: number;
}

const Buildings: React.FC = () => {
  const [buildings, setBuildings] = useState<Building[]>(buildingsData);
  const [open, setOpen] = useState(false);
  const [currentBuilding, setCurrentBuilding] = useState<Building | null>(null);
  const [search, setSearch] = useState('');

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Thêm trạng thái cho dialog xác nhận xóa
  const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);
  const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(null);

  // Thêm trạng thái cho Snackbar
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const handleOpen = (building: Building | null = null) => {
    setCurrentBuilding(building);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setCurrentBuilding(null);
  };

  const handleDeleteClick = (building: Building) => {
    setSelectedBuilding(building);
    setOpenDeleteDialog(true);
  };

  const handleConfirmDelete = () => {
    if (selectedBuilding) {
      setBuildings(buildings.filter((b) => b.id !== selectedBuilding.id));
      setOpenDeleteDialog(false);
      setSnackbar({
        open: true,
        message: `Đã xóa tòa nhà "${selectedBuilding.name}" thành công.`,
        severity: 'success',
      });
      setSelectedBuilding(null);
    }
  };

  const handleCancelDelete = () => {
    setOpenDeleteDialog(false);
    setSelectedBuilding(null);
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredBuildings = useMemo(
    () =>
      buildings.filter(
        (b) =>
          b.name.toLowerCase().includes(search.toLowerCase()) ||
          b.address.toLowerCase().includes(search.toLowerCase()) ||
          b.floors.toString().includes(search)
      ),
    [buildings, search]
  );

  const initialValues = {
    id: currentBuilding ? currentBuilding.id : 0, // id là kiểu number
    name: currentBuilding ? currentBuilding.name : '',
    address: currentBuilding ? currentBuilding.address : '',
    floors: currentBuilding ? currentBuilding.floors : 0, // floors là kiểu number
  };

  const validationSchema = Yup.object({
    name: Yup.string().required('Bắt buộc'),
    address: Yup.string().required('Bắt buộc'),
    floors: Yup.number().required('Bắt buộc').positive('Phải là số dương').integer('Phải là số nguyên'),
  });

  const handleSubmit = (values: typeof initialValues, { setSubmitting }: any) => {
    // Đảm bảo rằng floors là kiểu number
    const newValues = { ...values, floors: Number(values.floors) };

    if (newValues.id) {
      setBuildings(buildings.map((b) => (b.id === newValues.id ? newValues : b)));
      setSnackbar({
        open: true,
        message: `Đã cập nhật tòa nhà "${newValues.name}" thành công.`,
        severity: 'success',
      });
    } else {
      // Khi thêm mới, tạo id mới cho building
      setBuildings([...buildings, { ...newValues, id: buildings.length + 1 }]);
      setSnackbar({
        open: true,
        message: `Đã thêm tòa nhà "${newValues.name}" thành công.`,
        severity: 'success',
      });
    }
    setSubmitting(false);
    handleClose();
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom sx={{ mt: 4 }}>
        Thông Tin Tòa Nhà
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={() =>
          handleOpen({
            id: 0,
            name: '',
            address: '',
            floors: 0,
          })
        }
        sx={{ mb: 2 }}
      >
        Thêm Tòa Nhà
      </Button>
      <TextField
        variant="outlined"
        placeholder="Tìm kiếm..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        fullWidth
        sx={{ mb: 2 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <IconButton disabled>
                <SearchIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Tên Tòa Nhà</TableCell>
              <TableCell>Địa Chỉ</TableCell>
              <TableCell>Số Tầng</TableCell>
              <TableCell>Hành Động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredBuildings
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((building) => (
                <TableRow key={building.id}>
                  <TableCell>{building.id}</TableCell>
                  <TableCell>{building.name}</TableCell>
                  <TableCell>{building.address}</TableCell>
                  <TableCell>{building.floors}</TableCell>
                  <TableCell>
                    <IconButton
                      color="primary"
                      onClick={() => handleOpen(building)}
                      sx={{ mr: 1 }}
                      aria-label="edit"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleDeleteClick(building)}
                      aria-label="delete"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            {filteredBuildings.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  Không tìm thấy kết quả
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={filteredBuildings.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </TableContainer>

      {/* Dialog Thêm/Sửa Tòa Nhà */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{currentBuilding && currentBuilding.id ? 'Sửa Tòa Nhà' : 'Thêm Tòa Nhà'}</DialogTitle>
        <DialogContent>
          <Formik
            enableReinitialize
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ values, errors, touched, handleChange, handleBlur, isSubmitting }) => (
              <Form>
                <TextField
                  margin="dense"
                  label="Tên Tòa Nhà"
                  name="name"
                  value={values.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  fullWidth
                  error={touched.name && Boolean(errors.name)}
                  helperText={touched.name && errors.name}
                />
                <TextField
                  margin="dense"
                  label="Địa Chỉ"
                  name="address"
                  value={values.address}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  fullWidth
                  error={touched.address && Boolean(errors.address)}
                  helperText={touched.address && errors.address}
                />
                <TextField
                  margin="dense"
                  label="Số Tầng"
                  name="floors"
                  type="number"
                  value={values.floors}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  fullWidth
                  error={touched.floors && Boolean(errors.floors)}
                  helperText={touched.floors && errors.floors}
                />
                <DialogActions>
                  <Button onClick={handleClose} color="secondary">
                    Hủy
                  </Button>
                  <Button type="submit" variant="contained" color="primary" disabled={isSubmitting}>
                    Lưu
                  </Button>
                </DialogActions>
              </Form>
            )}
          </Formik>
        </DialogContent>
      </Dialog>

      {/* Dialog Xác Nhận Xóa */}
      <ConfirmDeleteDialog
        open={openDeleteDialog}
        title="Xác Nhận Xóa Tòa Nhà"
        description={`Bạn có chắc chắn muốn xóa tòa nhà "${selectedBuilding?.name}" không? Hành động này không thể hoàn tác.`}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />

      {/* Snackbar Thông Báo */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default React.memo(Buildings);
