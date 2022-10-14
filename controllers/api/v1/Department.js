import Department from "../../../models/Department.js";

export const createDepartment = async (req, res) => {
  try {
    //* missing check if the department exists already.

    const department = Department.create(req.body);

    return res.status(200).json({ message: "Department created Successfully" });
  } catch (error) {
    console.log(error.message);
    return res.status(200).json({ message: "Internal Server Error" });
  }
};

export const getDepartment = async (req, res) => {
  try {
    let response;

    const department = Department.findById(req.body.DepartmentId).lean();

    if (department)
      response = { message: "Department Found Successfully", department };
    else response = { message: "No Such Department exists", department };

    return res.status(200).json(response);
  } catch (error) {
    console.log(error.message);
    return res.status(200).json({ message: "Internal Server Error" });
  }
};
