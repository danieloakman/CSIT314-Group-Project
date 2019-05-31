import DBConnector from "./core";

// Load each database so that they can register with DB core
import "./user";
import "./vehicle";
import "./request";
import "./review";
import "./payment";

export default DBConnector;
