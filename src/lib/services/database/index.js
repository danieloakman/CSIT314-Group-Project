import DBConnector from "./core";

// Load each database so that they can register with DB core
import "./user";
import "./vehicle";
import "./request";
import "./offer";
import "./review";
import "./transaction";

export default DBConnector;
