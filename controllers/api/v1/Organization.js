import Organization from "../../../models/Organization.js";
import Department from "../../../models/Department.js";
import User from "../../../models/User.js";

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
    const organization = await Organization.findById(req.body.organizationId)
      .lean()
      .populate({
        path: "departments",
        select: "name users",
        model: Department,
        populate: {
          path: "users",
          select: "email burnout",
          model: User,
        },
      })
      .populate({
        path: "users",
        model: User,
      });

    let response;

    if (organization) {
      response = {
        message: "Organization Found",
        organization: {
          ...organization,
          averageBurnout: [
            {
              month: 3,
              avgBurnoutScores: [
                2, 3, 4, 2, 4, 2, 4, 1, 5, 1, 5, 1, 2, 4, 2, 5, 1, 4, 2, 4, 1,
                2, 4, 3, 3, 5, 3, 2, 1, 2, 5,
              ].reverse(),
            },
            {
              month: 4,
              avgBurnoutScores: [
                2, 3, 4, 2, 4, 2, 4, 1, 5, 1, 5, 1, 2, 4, 2, 5, 1, 4, 2, 4, 1,
                2, 4, 3, 3, 5, 3, 2, 1, 2,
              ],
            },
          ],
        },
      };
    } else response = { message: "No Such Organization Exists", organization };

    return res.status(200).json(response);
  } catch (error) {
    console.log(error.message);
    return res.status(200).json({ message: "Internal Server Error" });
  }
};
