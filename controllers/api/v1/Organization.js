import Organization from "../../../models/Organization.js";
import Department from "../../../models/Department.js";
import User from "../../../models/User.js";
import Action from "../../../models/Action.js";

const updateActionStatus = async (organizationId) => {
	try {
		const organization = await Organization.findById(organizationId).lean();

		organization.actions.map(async (actionId) => {
			const action = await Action.findById(actionId);
			const end = new Date(action.duration.endDate);
			const date = new Date();

			const endDate = end.getDate();
			const endMonth = end.getMonth() + 1;
			const endYear = end.getFullYear();

			const currDate = date.getDate();
			const currMonth = date.getMonth() + 1;
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
		const organizationId = req.user.organization;
		if (organizationId) updateActionStatus(organizationId);

		const organization = await Organization.findById(organizationId)
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
		console.log(organization);
		if (!organization)
			return res.status(400).json({ message: "Organization does not exist." });

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
		const organizationId = req.user.organization;
		const organization = await Organization.findById(organizationId);

		if (!organization)
			return res
				.status(200)
				.json({ message: "No such organization exists", organization });

		const action = await Action.create(req.body.action);

		organization.actions.push(action);
		await organization.save();

		const updatedOrg = await Organization.findById(req.body._id)
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

		updatedOrg.users = updatedOrg.users.map((user) => {
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

		updatedOrg.departments.map((department) => {
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

		return res.status(200).json({
			message: "action created successfully",
			organization: updatedOrg,
		});
	} catch (error) {
		console.log(error.message);
		return res.status(200).json({ message: "Internal Server Error" });
	}
};

export const updateAction = async (req, res) => {
	try {
		const organizationId = req.user.organization;
		const organization = await Organization.findById(organizationId).lean();

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

		const newOrganization = await Organization.findById(organizationId)
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

		newOrganization.users = newOrganization.users.map((user) => {
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

		newOrganization.departments.map((department) => {
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
		const organizationId = req.user.organization;
		const organization = await Organization.findById(organizationId);
		const currAction = await Action.findByIdAndDelete(req.body.actionId);

		organization.actions = organization.actions.filter(
			(action) => !action._id.equals(currAction._id)
		);

		await organization.save();

		const newOrganization = await Organization.findById(organizationId)
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

		newOrganization.users = newOrganization.users.map((user) => {
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

		newOrganization.departments.map((department) => {
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

		return res.status(200).json({
			message: "Action Deleted Successfully Error",
			organization: newOrganization,
		});
	} catch (error) {
		console.log(error);
		return res.status(200).json({ message: "Internal Server Error" });
	}
};
