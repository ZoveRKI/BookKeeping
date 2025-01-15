import React from 'react';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

interface DeleteRowButtonProps {
    onClick?: React.MouseEventHandler<SVGSVGElement>;
}

const DeleteRowButton: React.FC<DeleteRowButtonProps> = ({
    onClick
}) => {
    return (
        <DeleteOutlineIcon
            sx={{ color: 'red' }}
            onClick={onClick}
        />
    )
}

export default DeleteRowButton;
