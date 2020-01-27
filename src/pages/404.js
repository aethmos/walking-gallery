import React from 'react';
import Layout from '../components/layout';

const NotFoundPage = () => (
  <Layout>
      {sensorData => (
        <>
            <h1>NOT FOUND</h1>
            <p>Not a valid URL</p>
        </>
      )}
  </Layout>
);

export default NotFoundPage;
