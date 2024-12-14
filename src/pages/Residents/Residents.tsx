// src/pages/Residents/Residents.tsx
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
  Snackbar,
  Alert,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import residentsData from '../../data/residentsData';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import DeleteIcon from '@mui/icons-material/Delete';

interface Resident {
  id: number;
  name: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  idCardCode: string;
  apartmentNumber: string;
  relationshipWithHead: string;
}

const Residents: React.FC = () => {
  const [residents, setResidents] = useState<Resident[]>(residentsData);
  const [open, setOpen] = useState(false);
  const [currentResident, setCurrentResident] = useState<Resident>({
    id: 0,
    name: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    idCardCode: '',
    apartmentNumber: '',
    relationshipWithHead: '',
  });
  const [search, setSearch] = useState('');

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; id: number }>({
    open: false,
    id: 0,
  });

  const handleOpen = (resident: Resident = {
    id: 0,
    name: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    idCardCode: '',
    apartmentNumber: '',
    relationshipWithHead: '',
  }) => {
    setCurrentResident(resident);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDelete = (id: number) => {
    setDeleteDialog({ open: true, id });
  };

  const confirmDelete = () => {
    setResidents(residents.filter((r) => r.id !== deleteDialog.id));
    setDeleteDialog({ open: false, id: 0 });
    setSnackbar({ open: true, message: 'Xóa cư dân thành công!', severity: 'success' });
  };

  const cancelDelete = () => {
    setDeleteDialog({ open: false, id: 0 });
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredResidents = useMemo(
    () =>
      residents.filter(
        (r) =>
          r.name.toLowerCase().includes(search.toLowerCase()) ||
          r.email.toLowerCase().includes(search.toLowerCase()) ||
          r.phone.includes(search)
      ),
    [residents, search]
  );

  const initialValues = {
    id: currentResident.id || 0,
    name: currentResident.name || '',
    email: currentResident.email || '',
    phone: currentResident.phone || '',
    dateOfBirth: currentResident.dateOfBirth || '',
    idCardCode: currentResident.idCardCode || '',
    apartmentNumber: currentResident.apartmentNumber || '',
    relationshipWithHead: currentResident.relationshipWithHead || '',
  };

  const validationSchema = Yup.object({
    name: Yup.string().required('Bắt buộc'),
    email: Yup.string().email('Email không hợp lệ').required('Bắt buộc'),
    phone: Yup.string().matches(/^\d{10,15}$/, 'Số điện thoại không hợp lệ').required('Bắt buộc'),
    dateOfBirth: Yup.string().required('Bắt buộc'),
    idCardCode: Yup.string().required('Bắt buộc'),
    apartmentNumber: Yup.string().required('Bắt buộc'),
    relationshipWithHead: Yup.string().required('Bắt buộc'),
  });

  const handleSubmit = (values: typeof initialValues, { setSubmitting }: any) => {
    if (values.id) {
      setResidents(residents.map((r) => (r.id === values.id ? values : r)));
      setSnackbar({ open: true, message: 'Cập nhật cư dân thành công!', severity: 'success' });
    } else {
      setResidents([...residents, { ...values, id: residents.length + 1 }]);
      setSnackbar({ open: true, message: 'Thêm cư dân thành công!', severity: 'success' });
    }
    setSubmitting(false);
    handleClose();
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom sx={{ mt: 4 }}>
        Quản Lý Cư Dân
      </Typography>
      <Button variant="contained" color="primary" onClick={() => handleOpen()} sx={{ mb: 2 }}>
        Thêm Cư Dân
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
              <TableCell>Tên</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Số Điện Thoại</TableCell>
              <TableCell>Ngày Sinh</TableCell>
              <TableCell>Mã Căn Cước</TableCell>
              <TableCell>Số Căn Hộ</TableCell>
              <TableCell>Quan Hệ Với Chủ Hộ</TableCell>
              <TableCell>Hành Động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredResidents
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((resident) => (
                <TableRow key={resident.id}>
                  <TableCell>{resident.id}</TableCell>
                  <TableCell>{resident.name}</TableCell>
                  <TableCell>{resident.email}</TableCell>
                  <TableCell>{resident.phone}</TableCell>
                  <TableCell>{resident.dateOfBirth}</TableCell>
                  <TableCell>{resident.idCardCode}</TableCell>
                  <TableCell>{resident.apartmentNumber}</TableCell>
                  <TableCell>{resident.relationshipWithHead}</TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      color="secondary"
                      onClick={() => handleOpen(resident)}
                      sx={{ mr: 1 }}
                    >
                      Sửa
                    </Button>
                    <IconButton color="error" onClick={() => handleDelete(resident.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            {filteredResidents.length === 0 && (
              <TableRow>
                <TableCell colSpan={9} align="center">
                  Không tìm thấy kết quả
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={filteredResidents.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </TableContainer>

      {/* Dialog Thêm/Sửa Cư Dân */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{currentResident.id ? 'Sửa Cư Dân' : 'Thêm Cư Dân'}</DialogTitle>
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
                  label="Tên"
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
                  label="Email"
                  name="email"
                  type="email"
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  fullWidth
                  error={touched.email && Boolean(errors.email)}
                  helperText={touched.email && errors.email}
                />
                <TextField
                  margin="dense"
                  label="Số Điện Thoại"
                  name="phone"
                  value={values.phone}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  fullWidth
                  error={touched.phone && Boolean(errors.phone)}
                  helperText={touched.phone && errors.phone}
                />
                <TextField
                  margin="dense"
                  label="Ngày Sinh"
                  name="dateOfBirth"
                  type="date"
                  value={values.dateOfBirth}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  fullWidth
                  InputLabelProps={{
                    shrink: true,
                  }}
                  error={touched.dateOfBirth && Boolean(errors.dateOfBirth)}
                  helperText={touched.dateOfBirth && errors.dateOfBirth}
                />
                <TextField
                  margin="dense"
                  label="Mã Căn Cước"
                  name="idCardCode"
                  value={values.idCardCode}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  fullWidth
                  error={touched.idCardCode && Boolean(errors.idCardCode)}
                  helperText={touched.idCardCode && errors.idCardCode}
                />
                <TextField
                  margin="dense"
                  label="Số Căn Hộ"
                  name="apartmentNumber"
                  value={values.apartmentNumber}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  fullWidth
                  error={touched.apartmentNumber && Boolean(errors.apartmentNumber)}
                  helperText={touched.apartmentNumber && errors.apartmentNumber}
                />
                <TextField
                  margin="dense"
                  label="Quan Hệ Với Chủ Hộ"
                  name="relationshipWithHead"
                  select
                  InputLabelProps={{ shrink: true }}
                  SelectProps={{
                    native: true,
                  }}
                  value={values.relationshipWithHead}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  fullWidth
                  error={touched.relationshipWithHead && Boolean(errors.relationshipWithHead)}
                  helperText={touched.relationshipWithHead && errors.relationshipWithHead}
                >
                  <option value="">--Chọn--</option>
                  <option value="Chủ hộ">Chủ hộ</option>
                  <option value="Vợ">Vợ</option>
                  <option value="Chồng">Chồng</option>
                  <option value="Con">Con</option>
                  <option value="Anh/Chị">Anh/Chị</option>
                  <option value="Ông/Bà">Ông/Bà</option>
                  <option value="Khác">Khác</option>
                </TextField>
                <DialogActions>
                  <Button onClick={handleClose}>Hủy</Button>
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
      <Dialog open={deleteDialog.open} onClose={cancelDelete}>
        <DialogTitle>Xác Nhận Xóa</DialogTitle>
        <DialogContent>
          <Typography>Bạn có chắc chắn muốn xóa cư dân này?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelDelete}>Hủy</Button>
          <Button onClick={confirmDelete} color="error" variant="contained">
            Xóa
          </Button>
        </DialogActions>
      </Dialog>

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

export default React.memo(Residents);
