import axios from "axios";
import { baseUrl } from "../../constants/APIs";
import toast from "react-hot-toast";

const handleFollowLake = async (
  lakeId,
  status,
  setLoading,
  fetchFollowedLakes
) => {
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

    await fetchFollowedLakes();
    toast.success(response.data.message);
    window.location.reload();
  } catch (error) {
    console.log(error);
    if (error.response.status === 400) {
      return toast.error("You are already following this lake");
    }
    toast.error("Error following lake");
    console.error("Error following lake:", error);
  } finally {
    setLoading(false);
  }
};

export { handleFollowLake };
