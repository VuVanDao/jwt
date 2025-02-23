import { GroupRole, Group, Role } from "../models";

const getGroupWithRole = async (user) => {
  try {
    let result = await Group.findAll({
      where: {
        id: user.groupId,
      },
      include: {
        model: Role,
        attributes: {
          exclude: ["createdAt", "updatedAt", "GroupRole"],
        },
        through: { attributes: [] },
      },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
      raw: true,
      nest: true,
    });
    console.log("result", result);
    if (result) {
      return result;
    } else {
      return {};
    }
  } catch (error) {}
};
export { getGroupWithRole };
