/** @jsx jsx */
import { jsx } from "@emotion/core";
import animalReactions from "../constants/formOptions/animalReactions";
import FormSection from "./FormSection";
import Checkbox from "./formFields/Checkbox/Checkbox";


const AnimalReactionFormSection = ({ isViewOnly }) => {
    return (
        <FormSection>
               <div>
               <h4> Behvaiour </h4>
                {animalReactions.map((reaction) => (
                    <Checkbox
                        key={reaction}
                        name={reaction}
                        labelText={reaction}
                        isDisabled={isViewOnly}
                    >
                    </Checkbox>
            ))}
                </div>
        </FormSection>
    );
}


export default AnimalReactionFormSection;
