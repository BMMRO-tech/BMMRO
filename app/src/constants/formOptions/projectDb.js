import {useState, useContext} from "react";
import {FirebaseContext} from "../../firebaseContext/firebaseContext";
import {CollectionNames, generateProjectPath} from "../datastore";

const ProjectDb = async () => {


    const {datastore} = useContext(FirebaseContext);
    const extractProjectProperties = (project) => {
        const {projectName} =
            project.data;
        return {
            id: project.id,
            data: {
                projectName,
            },
        };
    };


    const projects = await datastore.readDocByPath(
        CollectionNames.PROJECT
    );

    if (!projects.length) {
        return [{entries: []}];
    }

    const extractedProjects = projects.map((project) =>
        extractProjectProperties(project)
    );
    return extractedProjects;

};

export default ProjectDb;

// export default [
//     extracted(),
// ];