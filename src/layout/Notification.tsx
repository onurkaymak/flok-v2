import { useAppDispatch } from "../hooks/useAppDispatch";
import { uiActions } from "../store/slices/ui-slice";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from "@mui/material";
import { InformationCircleIcon } from "@heroicons/react/24/outline";

interface NotificationProps {
  title: string;
  message: string;
}

const Notification = ({ title, message }: NotificationProps) => {
  const dispatch = useAppDispatch();

  const modalCloseHandler = () => {
    dispatch(uiActions.clearNotification());
  };

  return (
    <Dialog open={true} onClose={modalCloseHandler} disableEnforceFocus disableRestoreFocus>
      <DialogTitle>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-red-100">
            <InformationCircleIcon className="h-6 w-6 text-red-600" aria-hidden="true" />
          </div>
          <span className="text-base font-semibold text-gray-900">{title}</span>
        </div>
      </DialogTitle>
      <DialogContent dividers>
        <Typography className="py-2">{message}</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={modalCloseHandler} variant="contained" color="success">
          Okay
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default Notification;
