import React from 'react';
import { useParams } from 'react-router';
import Page from 'src/components/Page';
import EditUserForm from 'src/components/user/EditUserForm';

const EditUser = () => {
  const { userId } = useParams();
  return (
    <Page
      title="Edit User"
      main={<EditUserForm userId={userId} />}
    />
  );
};

export default EditUser;
