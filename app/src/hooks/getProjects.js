import { CollectionNames } from "../constants/datastore";

const getProjects = async (datastore) => {
  const extractProjectProperties = (project) => {
    const { projectName } = project.data;
    return projectName;
  };

  const projects = await datastore.readDocsFromCollection(
    CollectionNames.PROJECT
  );

  if (!projects.length) {
    return [{ entries: [] }];
  }

  return projects.map((project) => extractProjectProperties(project)).sort();
};

export { getProjects };
