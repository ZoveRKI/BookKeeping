import React from 'react';
import RowIconButton from './RowIconButton';

interface DeleteRowButtonProps {
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

const DeleteRowButton: React.FC<DeleteRowButtonProps> = ({ onClick }) => {
  return (
    <RowIconButton
      label="删除这一行"
      color="var(--action-delete, red)"
      path="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zm2-10h8v10H8V9zm7.5-5-1-1h-5l-1 1H5v2h14V4z"
      onClick={onClick}
    />
  );
};

export default DeleteRowButton;
