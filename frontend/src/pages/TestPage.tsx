import React from 'react';
import Button from '../components/atoms/Button';
import TextField from '../components/atoms/TextField';
import EditableCell from '../components/atoms/EditableCell';
import AddRowButton from '../components/atoms/AddRowButton';
import DeleteRowButton from '../components/atoms/DeleteRowButton';
import SaveRowButton from '../components/atoms/SaveRowButton';
import { LoadingAnimation } from '../components/organisms/LoadingAnimation';
import { DetailTable } from '../components/organisms/DetailTable';
// import ExpenseTable from '../components/organisms/ExpenseTable';

const TestPage: React.FC = () => {
  const elapsedDays = new Date().getDate();

  return (
    <>
      <h1>Welcome to the Test Page</h1>
      <Button variant="contained">Sign In</Button>
      <br />
      <br />
      <TextField id="test-user-name" label="UserName" />
      <TextField id="test-password" label="Password" />
      <EditableCell />
      <AddRowButton />
      <DeleteRowButton />
      <SaveRowButton />
      <br />
      <br />
      <LoadingAnimation />
      <br />
      <br />
      <div
        style={{
          width: '50%',
          margin: '0 auto',
          position: 'absolute',
          left: '25%',
          top: '0.5%',
        }}
      >
        <DetailTable
          DetailTableData={{
            elapsedDays: elapsedDays,
            totalMonthlyExpense: 1000,
            averageDailyExpense: 100,
            predictTotalMonthlyExpense: 2000,
          }}
        />
      </div>
      <br />
      <br />
      <Button variant="contained">Add Today</Button>
      <br />
      <br />
      {/* <ExpenseTable /> */}
    </>
  );
};

export default TestPage;
