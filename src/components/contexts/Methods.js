import axios from "axios";
import { baseUrl } from "../../constants/APIs";

const handleFollowLake = async (lakeId, status, setLoading) => {
  try {
    setLoading(true);
    const response = await axios.put(
      `${baseUrl}/api/users/follow`,
      {
        follow: status,
        lakeId: lakeId,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
  } catch (error) {
    console.error("Error following lake:", error);
  } finally {
    setLoading(false);
  }
};

export { handleFollowLake };
