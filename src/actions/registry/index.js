import { RegistryBuilder } from "seishiro";

import adminRegistry from "./admin";
import mentorRegistry from "./mentor";
import participantRegistry from "./participant";
import middlewareRegistry from "./middleware";

const registry = new RegistryBuilder();

registry.use(adminRegistry);
registry.use(mentorRegistry);
registry.use(participantRegistry);
registry.use(middlewareRegistry);

export default registry;
