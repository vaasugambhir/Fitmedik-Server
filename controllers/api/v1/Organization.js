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
        model: Department,
        populate: {
          path: "users",
          model: User,
          options: { lean: true },
        },
      })
      .populate({
        path: "users",
        model: User,
        options: { lean: true },
      });

    organization.users = organization.users.map((user) => {
      const dob = user.dob.split("/");
      const today = new Date();
      let age = 0;

      age += today.getFullYear() - parseInt(dob[2]);

      if (
        today.getMonth() - parseInt(dob[1]) !== 0 &&
        today.getDate() - parseInt(dob[0]) !== 0
      )
        age--;

      user.age = age;

      return user;
    });

    organization.departments.map((department) => {
      department.users = department.users.map((user) => {
        const dob = user.dob.split("/");
        const today = new Date();
        let age = 0;

        age += today.getFullYear() - parseInt(dob[2]);

        if (
          today.getMonth() - parseInt(dob[1]) !== 0 &&
          today.getDate() - parseInt(dob[0]) !== 0
        )
          age--;

        user.age = age;

        return user;
      });

      return department;
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
