import React from 'react';
import SaveIcon from '@mui/icons-material/Save';

interface SaveRowButtonProps {
    onClick?: React.MouseEventHandler<SVGSVGElement>;
}

const SaveRowButton: React.FC<SaveRowButtonProps> = ({
    onClick
}) => {
    return (
        <SaveIcon
            sx={{ color: 'green' }}
            onClick={onClick}
        />
    )
}

export default SaveRowButton;
