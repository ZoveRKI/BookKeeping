import React from 'react';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

interface AddRowButtonProps {
    onClick?: React.MouseEventHandler<SVGSVGElement>;
}

const AddRowButton: React.FC<AddRowButtonProps> = ({
    onClick
}) => {
    return (
        <AddCircleOutlineIcon
            sx={{ color: 'blue' }}
            onClick={onClick}
        />
    )
}

export default AddRowButton;
