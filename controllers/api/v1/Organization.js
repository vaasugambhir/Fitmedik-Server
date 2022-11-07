import Organization from "../../../models/Organization.js";
import Department from "../../../models/Department.js";
import User from "../../../models/User.js";
import Action from "../../../models/Action.js";

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

const updateActionStatus = async (organizationId) => {
  try {
    const organization = await Organization.findById(organizationId).lean();

    organization.actions.map(async (actionId) => {
      const action = await Action.findById(actionId);
      const { end } = action.duration;
      const date = new Date();

      const endDate = parseInt(end.split("/")[0]);
      const endMonth = parseInt(end.split("/")[1]);
      const endYear = parseInt(end.split("/")[2]);

      const currDate = date.getDate();
      const currMonth = date.getMonth();
      const currYear = date.getFullYear();

      if (currYear > endYear || currMonth > endMonth) {
        if (action.isCompleted) return;

        action.isCompleted = true;
        await action.save();
      } else if (
        currYear === endYear &&
        currMonth === endMonth &&
        currDate >= endDate
      ) {
        if (action.isCompleted) return;

        action.isCompleted = true;
        await action.save();
      }
    });
  } catch (error) {
    console.log(error.message);
  }
};

export const getOrganization = async (req, res) => {
  try {
    updateActionStatus(req.body.organizationId);

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
      })
      .populate({
        path: "actions",
        model: Action,
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

export const createAction = async (req, res) => {
  try {
    const organization = await Organization.findById(req.body._id);

    if (!organization)
      return res
        .status(200)
        .json({ message: "no such organization exists", organization });

    const action = await Action.create(req.body.action);

    organization.actions.push(action);
    await organization.save();

    const newOrganization = await Organization.findById(req.body._id)
      .lean()
      .populate({
        path: "actions",
        model: Action,
        options: { lean: true },
      });

    return res.status(200).json({
      message: "action created successfully",
      organization: newOrganization,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(200).json({ message: "Internal Server Error" });
  }
};

export const updateAction = async (req, res) => {
  try {
    const organization = await Organization.findById(
      req.body.organizationId
    ).lean();

    let action = await Action.findById(req.body.action._id);

    if (!organization || !action)
      return res
        .status(200)
        .json({ message: "no such organization/action exists", organization });

    const { name, description, duration, actionType, view, isCompleted } =
      req.body.action;

    action.name = name;
    action.description = description;
    action.duration = duration;
    action.actionType = actionType;
    action.view = view;
    action.isCompleted = isCompleted;

    await action.save();

    const newOrganization = await Organization.findById(req.body.organizationId)
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
      })
      .populate({
        path: "actions",
        model: Action,
        options: { lean: true },
      });

    return res.status(200).json({
      message: "action updated successfully",
      organization: newOrganization,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(200).json({ message: "Internal Server Error" });
  }
};

export const destroyAction = async (req, res) => {
  try {
    const organization = await Organization.findById(req.body.organizationId);
    const currAction = await Action.findByIdAndDelete(req.body.actionId);

    organization.actions = organization.actions.filter(
      (action) => !action._id.equals(currAction._id)
    );

    await organization.save();

    const newOrganization = await Organization.findById(req.body.organizationId)
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
      })
      .populate({
        path: "actions",
        model: Action,
        options: { lean: true },
      });
    
    return res
      .status(200)
      .json({
        message: "Action Deleted Successfully Error",
        organization: newOrganization,
      });
  } catch (error) {
    console.log(error);
    return res.status(200).json({ message: "Internal Server Error" });
  }
};
