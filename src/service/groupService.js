const { User, Group } = require("../models");
const handleGetAllGroup = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let result = [];
      result = await Group.findAll({
        attributes: {
          exclude: ["createdAt", "updatedAt", "password"],
        },
        order: [["name", "asc"]],
      });
      if (result) {
        resolve({
          errCode: 0,
          errMessage: "fetch all group complete",
          data: result,
        });
      } else {
        resolve({
          errCode: 1,
          errMessage: "fetch all group not complete",
          data: [],
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};
export { handleGetAllGroup };
