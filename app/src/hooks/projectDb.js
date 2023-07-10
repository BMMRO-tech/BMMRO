import { CollectionNames } from "../constants/datastore";

const projectDb = async (datastore) => {
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

  const extractedProjects = projects.map((project) =>
    extractProjectProperties(project)
  );
  return extractedProjects;
};

export default projectDb;
