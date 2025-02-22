import { handleGetAllGroup } from "../service/groupService";

const getAllGroup = async (req, res) => {
  try {
    let result = await handleGetAllGroup();
    res.status(200).json(result);
  } catch (error) {
    console.log("Error from getAllGroup", error);
    res.status(500).json({ errMessage: "Error from getAllGroup" });
  }
};
export { getAllGroup };
