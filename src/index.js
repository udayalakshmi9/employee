import React from "react";
import ReactDOM from "react-dom";
import CRUDTable, {
  Fields,
  Field,
  CreateForm,
  UpdateForm,
  DeleteForm
} from "react-crud-table";

// Component's Base CSS
import "./index.css";
//import tasks from 'sample.json';
const DescriptionRenderer = ({ field }) => <textarea {...field} />;

let emplists = require('./sample.json');

const SORTERS = {
  NUMBER_ASCENDING: mapper => (a, b) => mapper(a) - mapper(b),
  NUMBER_DESCENDING: mapper => (a, b) => mapper(b) - mapper(a),
  STRING_ASCENDING: mapper => (a, b) => mapper(a).localeCompare(mapper(b)),
  STRING_DESCENDING: mapper => (a, b) => mapper(b).localeCompare(mapper(a))
};

const getSorter = data => {
  const mapper = x => x[data.field];
  let sorter = SORTERS.STRING_ASCENDING(mapper);

  if (data.field === "id") {
    sorter =
      data.direction === "ascending"
        ? SORTERS.NUMBER_ASCENDING(mapper)
        : SORTERS.NUMBER_DESCENDING(mapper);
  } else {
    sorter =
      data.direction === "ascending"
        ? SORTERS.STRING_ASCENDING(mapper)
        : SORTERS.STRING_DESCENDING(mapper);
  }

  return sorter;
};

let count = emplists.length;
const service = {
  fetchItems: payload => {
    let result = Array.from(emplists);
    result = result.sort(getSorter(payload.sort));
    return Promise.resolve(result);
  },
  create: emplist => {
    count += 1;
    emplists.push({
      ...emplist,
      id: count
    });
    return Promise.resolve(emplist);
  },
  update: data => {
    const emplist = emplists.find(t => t.id === data.id);
    emplist.name = data.name;
    emplist.email = data.email;
    return Promise.resolve(emplist);
  },
  delete: data => {
    const emplist = emplists.find(t => t.id === data.id);
    emplists = emplists.filter(t => t.id !== emplist.id);
    return Promise.resolve(emplist);
  }
};

const styles = {
  container: { color:"black", "background-color":"gray", margin: "auto", width: "fit-content" }
};

const Example = () => (
  <div style={styles.container}>
    <CRUDTable
      caption="Tasks"
      fetchItems={payload => service.fetchItems(payload)}
    >
      <Fields>
        <Field name="id" label="Id" hideInCreateForm />
        <Field name="name" label="Name" placeholder="Name" />
        <Field name="email" label="Email" placeholder="Email" />
       
      </Fields>
      <CreateForm
        title="Emp Creation"
        message="Create a new Employee!"
        trigger="Create Emp"
        onSubmit={emplist => service.create(emplist)}
        submitText="Create"
        validate={values => {
          const errors = {};
          if (!values.name) {
            errors.name = "Please, provide Employee name";
          }

          if (!values.email) {
            errors.email = "Please, provide Employee Email";
          }

          return errors;
        }}
      />

      <UpdateForm
        title="Employee Update Process"
        message="Update Employee"
        trigger="Update"
        onSubmit={emplist => service.update(emplist)}
        submitText="Update"
        validate={values => {
          const errors = {};

          if (!values.id) {
            errors.id = "Please, provide id";
          }

          if (!values.name) {
            errors.name = "Please, provide Employee name";
          }

          if (!values.email) {
            errors.email = "Please, provide Employee Email";
          }

          return errors;
        }}
      />

      <DeleteForm
        title="Employee Delete Process"
        message="Are you sure you want to delete the Employee?"
        trigger="Delete"
        onSubmit={emplist => service.delete(emplist)}
        submitText="Delete"
        validate={values => {
          const errors = {};
          if (!values.id) {
            errors.id = "Please, provide id";
          }
          return errors;
        }}
      />
    </CRUDTable>
  </div>
);

Example.propTypes = {};

ReactDOM.render(<Example />, document.getElementById("root"));
