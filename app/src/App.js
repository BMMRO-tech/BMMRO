import React from "react";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import Layout from "./components/Layout";

const App = () => {
  return (
    <Layout>
      <h1>Hello BMMRO</h1>
      <Formik
        initialValues={{ date: '', encSeqNo: '', species: '' }}
        validate={values => {
          const errors = {};
          const errorMessage = 'Required'; 
          if (!values.date) {
            errors.date = errorMessage;
          }
          if (!values.encSeqNo) {
            errors.encSeqNo = errorMessage;
          }
          if (!values.species) {
            errors.species = errorMessage;
          }
          return errors;
        }}
        onSubmit={(values) => console.log(values)}
      >
      <Form>
        <Field type="text" name="date" />
        <ErrorMessage name="date" component="span" />
        <Field type="text" name="encSeqNo" />
        <ErrorMessage name="encSeqNo" component="span" />
        <Field type="text" name="species" />
        <ErrorMessage name="species" component="span" />
        <button type="submit">
          Submit
        </button>
      </Form>
    </Formik></Layout>
    );
};

export default App;
