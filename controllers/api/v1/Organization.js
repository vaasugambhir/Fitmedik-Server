import Organization from "../../../models/Organization.js";

export const createOrganization = async (req, res) => {
  try {
    const organization = await Organization.create(req.body);

    //* missing check if the organization exists already.

    return res
      .status(200)
      .json({ message: "Organization created Successfully", organization });
  } catch (error) {
    console.log(error.message);
    return res.status(200).json({ message: "Internal Server Error" });
  }
};

export const getOrganization = async (req, res) => {
  try {
    const organization = await Organization.findById(req.organizationId).lean();

    let response;

    if (organization)
      response = { message: "Organization Found", organization };
    else response = { message: "No Such Organization Exists", organization };

    return res.status(200).json(response);
  } catch (error) {
    console.log(error.message);
    return res.status(200).json({ message: "Internal Server Error" });
  }
};
