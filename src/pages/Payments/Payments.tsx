// src/pages/Payments/Payments.tsx
import React, { useState, useMemo } from 'react';
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
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
  Button,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import ConfirmDeleteDialog from '../../components/ConfirmDeleteDialog';
import paymentsData from '../../data/paymentsData';

export interface Payment {
  id: number;
  resident: string;
  amount: number;
  date: string;
  status: string;
  apartment: string;
  method: string;
  receiptNumber: string;
  notes?: string;
}

const Payments: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>(paymentsData);
  const [open, setOpen] = useState(false);
  const [currentPayment, setCurrentPayment] = useState<Payment>({
    id: 0,
    resident: '',
    amount: 0,
    date: '',
    status: '',
    apartment: '',
    method: '',
    receiptNumber: '',
    notes: '',
  });
  const [search, setSearch] = useState('');

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);

  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const handleOpen = (payment: Payment | null = null) => {
    setCurrentPayment(
      payment || {
        id: 0,
        resident: '',
        amount: 0,
        date: '',
        status: '',
        apartment: '',
        method: '',
        receiptNumber: '',
        notes: '',
      }
    );
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setCurrentPayment({
      id: 0,
      resident: '',
      amount: 0,
      date: '',
      status: '',
      apartment: '',
      method: '',
      receiptNumber: '',
      notes: '',
    });
  };

  const handleDeleteClick = (payment: Payment) => {
    setSelectedPayment(payment);
    setOpenDeleteDialog(true);
  };

  const handleConfirmDelete = () => {
    if (selectedPayment) {
      setPayments(payments.filter((p) => p.id !== selectedPayment.id));
      setOpenDeleteDialog(false);
      setSnackbar({
        open: true,
        message: `Đã xóa thanh toán của "${selectedPayment.resident}" thành công.`,
        severity: 'success',
      });
      setSelectedPayment(null);
    }
  };

  const handleCancelDelete = () => {
    setOpenDeleteDialog(false);
    setSelectedPayment(null);
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

  const filteredPayments = useMemo(() => {
    const lowerSearch = search.toLowerCase();
    return payments.filter((p) => {
      return (
        p.resident.toLowerCase().includes(lowerSearch) ||
        p.amount.toString().includes(search) ||
        p.date.includes(search) ||
        p.status.toLowerCase().includes(lowerSearch) ||
        p.apartment.toLowerCase().includes(lowerSearch) ||
        p.method.toLowerCase().includes(lowerSearch) ||
        p.receiptNumber.toLowerCase().includes(lowerSearch) ||
        (p.notes && p.notes.toLowerCase().includes(lowerSearch))
      );
    });
  }, [payments, search]);

  const initialValues = {
    id: currentPayment.id,
    resident: currentPayment.resident,
    amount: currentPayment.amount,
    date: currentPayment.date,
    status: currentPayment.status,
    apartment: currentPayment.apartment,
    method: currentPayment.method,
    receiptNumber: currentPayment.receiptNumber,
    notes: currentPayment.notes || '',
  };

  const validationSchema = Yup.object({
    resident: Yup.string().required('Bắt buộc'),
    amount: Yup.number().required('Bắt buộc').positive('Phải là số dương'),
    date: Yup.date().required('Bắt buộc'),
    status: Yup.string().required('Bắt buộc'),
    apartment: Yup.string().required('Bắt buộc'),
    method: Yup.string().required('Bắt buộc'),
    receiptNumber: Yup.string().required('Bắt buộc'),
    notes: Yup.string().notRequired(),
  });

  const handleSubmit = (values: typeof initialValues, { setSubmitting }: any) => {
    if (values.id) {
      setPayments((prev) =>
        prev.map((p) => (p.id === values.id ? { ...p, ...values, amount: Number(values.amount) } : p))
      );
      setSnackbar({
        open: true,
        message: `Đã cập nhật thanh toán của "${values.resident}" thành công.`,
        severity: 'success',
      });
    } else {
      setPayments((prev) => [
        ...prev,
        { ...values, id: prev.length + 1, amount: Number(values.amount) },
      ]);
      setSnackbar({
        open: true,
        message: `Đã thêm thanh toán của "${values.resident}" thành công.`,
        severity: 'success',
      });
    }
    setSubmitting(false);
    handleClose();
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom sx={{ mt: 4 }}>
        Quản Lý Thanh Toán
      </Typography>
      <Button variant="contained" color="primary" onClick={() => handleOpen()} sx={{ mb: 2 }}>
        Thêm Thanh Toán
      </Button>
      <TextField
        variant="outlined"
        placeholder="Tìm kiếm..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        fullWidth
        sx={{ mb: 2 }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton>
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
              <TableCell>Cư Dân</TableCell>
              <TableCell>Số Tiền</TableCell>
              <TableCell>Ngày</TableCell>
              <TableCell>Trạng Thái</TableCell>
              <TableCell>Căn Hộ</TableCell>
              <TableCell>Phương Thức</TableCell>
              <TableCell>Số Biên Lai</TableCell>
              <TableCell>Ghi Chú</TableCell>
              <TableCell>Hành Động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredPayments
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell>{payment.resident}</TableCell>
                  <TableCell>{payment.amount}</TableCell>
                  <TableCell>{payment.date}</TableCell>
                  <TableCell>{payment.status}</TableCell>
                  <TableCell>{payment.apartment}</TableCell>
                  <TableCell>{payment.method}</TableCell>
                  <TableCell>{payment.receiptNumber}</TableCell>
                  <TableCell>{payment.notes}</TableCell>
                  <TableCell>
                    <IconButton
                      color="primary"
                      onClick={() => handleOpen(payment)}
                      sx={{ mr: 1 }}
                      aria-label="edit"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleDeleteClick(payment)}
                      aria-label="delete"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            {filteredPayments.length === 0 && (
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
          count={filteredPayments.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </TableContainer>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{currentPayment.id ? 'Sửa Thanh Toán' : 'Thêm Thanh Toán'}</DialogTitle>
        <DialogContent>
          <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
            {({ values, handleChange, handleSubmit, errors, touched }) => (
              <Form onSubmit={handleSubmit}>
                <TextField
                  label="Cư Dân"
                  name="resident"
                  value={values.resident}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                  error={touched.resident && !!errors.resident}
                  helperText={touched.resident && errors.resident}
                />
                <TextField
                  label="Số Tiền"
                  name="amount"
                  value={values.amount}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                  error={touched.amount && !!errors.amount}
                  helperText={touched.amount && errors.amount}
                />
                <TextField
                  label="Ngày"
                  name="date"
                  type="date"
                  value={values.date}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                  InputLabelProps={{ shrink: true }}
                  error={touched.date && !!errors.date}
                  helperText={touched.date && errors.date}
                />
                <TextField
                  label="Trạng Thái"
                  name="status"
                  value={values.status}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                  error={touched.status && !!errors.status}
                  helperText={touched.status && errors.status}
                />
                <TextField
                  label="Căn Hộ"
                  name="apartment"
                  value={values.apartment}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                  error={touched.apartment && !!errors.apartment}
                  helperText={touched.apartment && errors.apartment}
                />
                <TextField
                  label="Phương Thức"
                  name="method"
                  value={values.method}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                  error={touched.method && !!errors.method}
                  helperText={touched.method && errors.method}
                />
                <TextField
                  label="Số Biên Lai"
                  name="receiptNumber"
                  value={values.receiptNumber}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                  error={touched.receiptNumber && !!errors.receiptNumber}
                  helperText={touched.receiptNumber && errors.receiptNumber}
                />
                <TextField
                  label="Ghi Chú"
                  name="notes"
                  value={values.notes}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                  multiline
                  rows={3}
                />
                <DialogActions>
                  <Button onClick={handleClose} color="secondary">
                    Hủy
                  </Button>
                  <Button type="submit" color="primary">
                    Lưu
                  </Button>
                </DialogActions>
              </Form>
            )}
          </Formik>
        </DialogContent>
      </Dialog>

      <ConfirmDeleteDialog
        open={openDeleteDialog}
        title="Xác Nhận Xóa Thanh Toán"
        description={`Bạn có chắc chắn muốn xóa thanh toán của "${selectedPayment?.resident}" không? Hành động này không thể hoàn tác.`}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />

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

export default Payments;
