import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button, Snackbar, Alert } from '@mui/material';
import useAuth from '../../hooks/useAuth';

interface ChangePasswordDialogProps {
  open: boolean;
  onClose: () => void;
}

const ChangePasswordDialog: React.FC<ChangePasswordDialogProps> = ({ open, onClose }) => {
  const { changePassword } = useAuth();
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success'|'error' });

  const handleChangePassword = () => {
    if (newPassword !== confirmPassword) {
      setSnackbar({ open: true, message: 'Mật khẩu mới không khớp', severity: 'error' });
      return;
    }

    const success = changePassword(oldPassword, newPassword);
    if (success) {
      setSnackbar({ open: true, message: 'Đổi mật khẩu thành công', severity: 'success' });
      onClose(); 
    } else {
      setSnackbar({ open: true, message: 'Đổi mật khẩu thất bại, kiểm tra mật khẩu cũ', severity: 'error' });
    }
  };

  return (
    <>
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>Đổi Mật Khẩu</DialogTitle>
        <DialogContent>
          <TextField
            label="Mật Khẩu Cũ"
            type="password"
            fullWidth
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Mật Khẩu Mới"
            type="password"
            fullWidth
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Xác Nhận Mật Khẩu Mới"
            type="password"
            fullWidth
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            sx={{ mb: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Hủy</Button>
          <Button onClick={handleChangePassword} color="primary">Lưu</Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default ChangePasswordDialog;
