import { Account } from '@components/type';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  TextField,
} from '@mui/material';

const EditAccountModal = ({
  openEditDialog,
  handleCloseEditDialog,
  currentAccount,
  handleEditAccountChange,
  handleSaveEdit,
}: {
  openEditDialog: boolean;
  handleCloseEditDialog: () => void;
  currentAccount: Account | null;
  handleEditAccountChange: (field: string, value: string) => void;
  handleSaveEdit: () => void;
}) => {
  return (
    <Dialog open={openEditDialog} onClose={handleCloseEditDialog}>
      <DialogTitle>Edit Account</DialogTitle>
      <DialogContent>
        <TextField
          margin="dense"
          label="Username"
          value={currentAccount?.username || ''}
          onChange={(e) => handleEditAccountChange('username', e.target.value)}
          fullWidth
        />
        <TextField
          margin="dense"
          label="Email"
          value={currentAccount?.email || ''}
          onChange={(e) => handleEditAccountChange('email', e.target.value)}
          fullWidth
        />
        <TextField
          margin="dense"
          label="Role"
          value={currentAccount?.role || ''}
          onChange={(e) => handleEditAccountChange('role', e.target.value)}
          select
          fullWidth
        >
          <MenuItem value="Admin">Admin</MenuItem>
          <MenuItem value="User">User</MenuItem>
        </TextField>
        <TextField
          margin="dense"
          label="Status"
          value={currentAccount?.status || ''}
          onChange={(e) => handleEditAccountChange('status', e.target.value)}
          select
          fullWidth
        >
          <MenuItem value="Active">Active</MenuItem>
          <MenuItem value="Inactive">Inactive</MenuItem>
        </TextField>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseEditDialog}>Cancel</Button>
        <Button onClick={handleSaveEdit} color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditAccountModal;
