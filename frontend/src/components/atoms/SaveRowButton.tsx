import React from 'react';
import RowIconButton from './RowIconButton';

interface SaveRowButtonProps {
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

const SaveRowButton: React.FC<SaveRowButtonProps> = ({ onClick }) => {
  return (
    <RowIconButton
      label="保存这一行"
      color="var(--action-save, green)"
      path="M17 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zM15 9H5V5h10v4z"
      onClick={onClick}
    />
  );
};

export default SaveRowButton;
