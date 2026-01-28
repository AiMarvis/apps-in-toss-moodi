import React from 'react';
import { ConfirmDialog } from '@toss/tds-mobile';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  variant?: 'default' | 'danger';
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title,
  message,
  confirmText = '확인',
  cancelText = '취소',
  onConfirm,
  onCancel,
  variant = 'default',
}) => {
  return (
    <ConfirmDialog
      open={isOpen}
      title={title}
      description={message}
      onClose={onCancel}
      cancelButton={
        <ConfirmDialog.CancelButton onClick={onCancel}>
          {cancelText}
        </ConfirmDialog.CancelButton>
      }
      confirmButton={
        <ConfirmDialog.ConfirmButton
          onClick={onConfirm}
          color={variant === 'danger' ? 'danger' : 'primary'}
        >
          {confirmText}
        </ConfirmDialog.ConfirmButton>
      }
    />
  );
};
