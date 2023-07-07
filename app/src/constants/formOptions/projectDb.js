import { CollectionNames } from "../datastore";

const ProjectDb = async (datastore) => {
  const extractProjectProperties = (project) => {
    const { projectName } = project.data;
    return {
      id: project.id,
      data: {
        projectName,
      },
    };
  };

  const projects = await datastore.readDocByPath(CollectionNames.PROJECT).name;

  if (!projects.length) {
    return [{ entries: [] }];
  }

  const extractedProjects = projects.map((project) =>
    extractProjectProperties(project)
  );
  return extractedProjects;
};

export default ProjectDb;

// export default [
//     "Sabrina",
// ];
