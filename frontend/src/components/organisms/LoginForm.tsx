import {
    Button as MuiButton,
    TextField as MuiTextField,
    Box
} from "@mui/material";

export const LoginForm: React.FC = () => {
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100vh',  // 让盒子占据整个视口高度
                backgroundColor: '#f5f5f5',  // 可以设置背景色（可选）
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 3,  // 内边距
                    border: '1px solid #ccc',  // 边框
                    borderRadius: 2,  // 边框圆角
                    boxShadow: 3,  // 阴影效果
                    backgroundColor: 'white',  // 背景色
                    width: '300px',  // 宽度
                }}
            >
                <h1>LogIn</h1>
                <MuiTextField id="outlined-basic" label="UserName" variant="outlined" fullWidth sx={{ mb: 2 }} />
                <MuiTextField id="outlined-basic" label="Password" variant="outlined" fullWidth sx={{ mb: 2 }} />
                <MuiButton variant="contained">Sign In</MuiButton>
            </Box>
        </Box>
    );
};
