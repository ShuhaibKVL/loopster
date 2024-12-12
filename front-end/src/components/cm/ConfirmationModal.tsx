import swal from 'sweetalert';
import '../../app/globals.css'

interface ConfirmOptions {
  title?: string;
  text?: string;
  icon?: 'warning' | 'error' | 'success' | 'info';
  dangerMode?: boolean;
}

export const confirmAction = async (options: ConfirmOptions): Promise<boolean> => {
  
const {
    title = 'Are you sure?',
    text = 'This action cannot be undone.',
    icon = 'warning',
    dangerMode = true
} = options;

const willProceed = await swal({
    title,
    text,
    icon,
    buttons: {
        cancel: {
          text: "Cancel",
          value: false,
          visible: true,
          className: "bg-[var(--color-bg)]",
          closeModal: true,
        },
        confirm: {
          text: "Yes",
          value: true,
          visible: true,
          className: "bg-secondary",
          closeModal: true,
        },
      },
      dangerMode,
      className: 'bg-[var(--secondary-bg)]',
});

    return willProceed;
};