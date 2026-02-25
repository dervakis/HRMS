import React from "react";
import { Modal, Button, Spinner, ModalHeader, ModalBody } from "flowbite-react";

interface ConfirmModalProps {
  open: boolean;
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  loading?: boolean;
  danger?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  open,
  title = "Confirm Action",
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  loading = false,
  danger = false,
  onConfirm,
  onClose,
}) => {
  return (
    <Modal show={open} size="md" onClose={onClose} popup>
      <ModalHeader/>
      <ModalBody>
        <div className="text-center">
          <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
            {title}
          </h3>

          <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
            {message}
          </p>

          <div className="flex justify-center gap-4">
            <Button
              color={danger ? "red" : "blue"}
              onClick={onConfirm}
              disabled={loading}
            >
              {loading ? <Spinner size="sm" /> : confirmText}
            </Button>

            <Button color="gray" onClick={onClose} disabled={loading}>
              {cancelText}
            </Button>
          </div>
        </div>
      </ModalBody>
    </Modal>
  );
};

export default ConfirmModal;