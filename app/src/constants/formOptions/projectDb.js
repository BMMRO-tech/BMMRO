import {CollectionNames} from "../datastore";

const projectDb = async (datastore) => {
    const extractProjectProperties = (project) => {
        const {projectName} = project.data;
        return projectName;
    };

    const projects = await datastore.readDocsFromCollection(CollectionNames.PROJECT);

    console.log(projects)

    if (!projects.length) {
        return [{entries: []}];
    }

    const extractedProjects = projects.map((project) =>
        extractProjectProperties(project)
    );
    return extractedProjects;
};

// export  projectDb;
export default projectDb;

// export default [
//     "Sabrina",
// ];
