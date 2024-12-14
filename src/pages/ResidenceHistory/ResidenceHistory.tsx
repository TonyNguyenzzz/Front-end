// src/pages/ResidenceHistory/ResidenceHistory.tsx
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
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import ConfirmDeleteDialog from '../../components/ConfirmDeleteDialog';
import residenceHistoryData from '../../data/residenceHistoryData';

interface ResidenceRecord {
  id: number;
  resident: string;
  apartment: string;
  moveIn: string;
  moveOut: string;
  dateOfBirth: string;
  contact: string;
  reasonForMove: string;
  previousApartment?: string;
  familySize: number;
  notes?: string;
}

const ResidenceHistory: React.FC = () => {
  const [records, setRecords] = useState<ResidenceRecord[]>(residenceHistoryData);
  const [open, setOpen] = useState(false);
  const [currentRecord, setCurrentRecord] = useState<ResidenceRecord | null>(null);
  const [search, setSearch] = useState('');

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);
  const [selectedRecord, setSelectedRecord] = useState<ResidenceRecord | null>(null);

  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const handleOpen = (record: ResidenceRecord | null = null) => {
    setCurrentRecord(record);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setCurrentRecord(null);
  };

  const handleDeleteClick = (record: ResidenceRecord) => {
    setSelectedRecord(record);
    setOpenDeleteDialog(true);
  };

  const handleConfirmDelete = () => {
    if (selectedRecord) {
      setRecords(records.filter((r) => r.id !== selectedRecord.id));
      setOpenDeleteDialog(false);
      setSnackbar({
        open: true,
        message: `Đã xóa hồ sơ cư trú của "${selectedRecord.resident}" thành công.`,
        severity: 'success',
      });
      setSelectedRecord(null);
    }
  };

  const handleCancelDelete = () => {
    setOpenDeleteDialog(false);
    setSelectedRecord(null);
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

  const filteredRecords = useMemo(
    () =>
      records.filter(
        (r) =>
          r.resident.toLowerCase().includes(search.toLowerCase()) ||
          r.apartment.toLowerCase().includes(search.toLowerCase()) ||
          r.reasonForMove.toLowerCase().includes(search.toLowerCase()) ||
          r.contact.toLowerCase().includes(search.toLowerCase())
      ),
    [records, search]
  );

  const initialValues = {
    id: currentRecord ? currentRecord.id : 0,
    resident: currentRecord ? currentRecord.resident : '',
    apartment: currentRecord ? currentRecord.apartment : '',
    moveIn: currentRecord ? currentRecord.moveIn : '',
    moveOut: currentRecord ? currentRecord.moveOut : '',
    dateOfBirth: currentRecord ? currentRecord.dateOfBirth : '',
    contact: currentRecord ? currentRecord.contact : '',
    reasonForMove: currentRecord ? currentRecord.reasonForMove : '',
    previousApartment: currentRecord ? currentRecord.previousApartment || '' : '',
    familySize: currentRecord ? currentRecord.familySize : 1,
    notes: currentRecord ? currentRecord.notes || '' : '',
  };

  const validationSchema = Yup.object({
    resident: Yup.string().required('Bắt buộc'),
    apartment: Yup.string().required('Bắt buộc'),
    moveIn: Yup.date().required('Bắt buộc'),
    moveOut: Yup.date().required('Bắt buộc'),
    dateOfBirth: Yup.date().required('Bắt buộc'),
    contact: Yup.string().required('Bắt buộc'),
    reasonForMove: Yup.string().required('Bắt buộc'),
    familySize: Yup.number().required('Bắt buộc').positive('Phải là số dương').integer('Phải là số nguyên'),
  });

  const handleSubmit = (values: typeof initialValues, { setSubmitting }: any) => {
    const newValues: ResidenceRecord = {
      ...values,
      id: values.id || records.length + 1,
      familySize: Number(values.familySize),
      previousApartment: values.previousApartment || undefined,
      notes: values.notes || undefined,
    };

    if (values.id) {
      setRecords(records.map((r) => (r.id === values.id ? newValues : r)));
      setSnackbar({
        open: true,
        message: `Đã cập nhật hồ sơ cư trú của "${newValues.resident}" thành công.`,
        severity: 'success',
      });
    } else {
      setRecords([...records, newValues]);
      setSnackbar({
        open: true,
        message: `Đã thêm hồ sơ cư trú của "${newValues.resident}" thành công.`,
        severity: 'success',
      });
    }
    setSubmitting(false);
    handleClose();
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom sx={{ mt: 4 }}>
        Lịch Sử Cư Trú
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={() =>
          handleOpen({
            id: 0,
            resident: '',
            apartment: '',
            moveIn: '',
            moveOut: '',
            dateOfBirth: '',
            contact: '',
            reasonForMove: '',
            familySize: 1,
          })
        }
        sx={{ mb: 2 }}
      >
        Thêm Hồ Sơ Cư Trú
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
              <TableCell>Cư Dân</TableCell>
              <TableCell>Căn Hộ</TableCell>
              <TableCell>Ngày Vào</TableCell>
              <TableCell>Ngày Ra</TableCell>
              <TableCell>Lý Do</TableCell>
              <TableCell>Hành Động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredRecords
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((record) => (
                <TableRow key={record.id}>
                  <TableCell>{record.id}</TableCell>
                  <TableCell>{record.resident}</TableCell>
                  <TableCell>{record.apartment}</TableCell>
                  <TableCell>{record.moveIn}</TableCell>
                  <TableCell>{record.moveOut}</TableCell>
                  <TableCell>{record.reasonForMove}</TableCell>
                  <TableCell>
                    <IconButton
                      color="primary"
                      onClick={() => handleOpen(record)}
                      sx={{ mr: 1 }}
                      aria-label="edit"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleDeleteClick(record)}
                      aria-label="delete"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            {filteredRecords.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  Không tìm thấy kết quả
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={filteredRecords.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </TableContainer>

      {/* Dialog Thêm/Sửa Hồ Sơ Cư Trú */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{currentRecord && currentRecord.id ? 'Sửa Hồ Sơ Cư Trú' : 'Thêm Hồ Sơ Cư Trú'}</DialogTitle>
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
                  label="Cư Dân"
                  name="resident"
                  value={values.resident}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  fullWidth
                  error={touched.resident && Boolean(errors.resident)}
                  helperText={touched.resident && errors.resident}
                />
                <TextField
                  margin="dense"
                  label="Căn Hộ"
                  name="apartment"
                  value={values.apartment}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  fullWidth
                  error={touched.apartment && Boolean(errors.apartment)}
                  helperText={touched.apartment && errors.apartment}
                />
                <TextField
                  margin="dense"
                  label="Ngày Vào"
                  name="moveIn"
                  type="date"
                  value={values.moveIn}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  error={touched.moveIn && Boolean(errors.moveIn)}
                  helperText={touched.moveIn && errors.moveIn}
                />
                <TextField
                  margin="dense"
                  label="Ngày Ra"
                  name="moveOut"
                  type="date"
                  value={values.moveOut}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  error={touched.moveOut && Boolean(errors.moveOut)}
                  helperText={touched.moveOut && errors.moveOut}
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
                  InputLabelProps={{ shrink: true }}
                  error={touched.dateOfBirth && Boolean(errors.dateOfBirth)}
                  helperText={touched.dateOfBirth && errors.dateOfBirth}
                />
                <TextField
                  margin="dense"
                  label="Liên Hệ"
                  name="contact"
                  value={values.contact}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  fullWidth
                  error={touched.contact && Boolean(errors.contact)}
                  helperText={touched.contact && errors.contact}
                />
                <TextField
                  margin="dense"
                  label="Lý Do Di Chuyển"
                  name="reasonForMove"
                  value={values.reasonForMove}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  fullWidth
                  error={touched.reasonForMove && Boolean(errors.reasonForMove)}
                  helperText={touched.reasonForMove && errors.reasonForMove}
                />
                <TextField
                  margin="dense"
                  label="Căn Hộ Trước (Nếu Có)"
                  name="previousApartment"
                  value={values.previousApartment}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  fullWidth
                />
                <TextField
                  margin="dense"
                  label="Số Người Trong Gia Đình"
                  name="familySize"
                  type="number"
                  value={values.familySize}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  fullWidth
                  error={touched.familySize && Boolean(errors.familySize)}
                  helperText={touched.familySize && errors.familySize}
                />
                <TextField
                  margin="dense"
                  label="Ghi Chú"
                  name="notes"
                  value={values.notes}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  fullWidth
                  multiline
                  rows={3}
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
        title="Xác Nhận Xóa Hồ Sơ Cư Trú"
        description={`Bạn có chắc chắn muốn xóa hồ sơ cư trú của "${selectedRecord?.resident}" không? Hành động này không thể hoàn tác.`}
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

export default React.memo(ResidenceHistory);
