import { useToast } from "@/components/ui/use-toast";
import Axios from "axios";
import { getCookie } from "cookies-next";
// import { toast } from 'path-to-toast-component'; // Update with the actual path

const version1 = "v1";

const fetchingData = async ({
  url,
  headers,
  method = "GET",
  body,
  context,
}) => {
  const token = getCookie("token", context ? { req: context.req } : undefined);
  const axiosInstance = Axios.create({
    baseURL: `${
      process.env.SECRET_API_URL || process.env.NEXT_PUBLIC_API_URL
    }/${version1}`,
    headers: {
      ...headers,
    },
    timeout: 5000,
    // withCredentials: true // Uncomment if needed, see notes below
  });

  axiosInstance.interceptors.request.use((config) => {
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
      const { response } = error;
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      } else if (error.request) {
        // The request was made but no response was received
        console.log(error.request);
      } else if (
        typeof window !== "undefined" &&
        error.response &&
        response?.data?.message === "Authorization failed"
      ) {
        console.log("Redirecting to login page");
        window.location.href = "/";
        // toast({
        //   title: "An error occurred.",
        //   description: "Token is expired, please login again",
        //   status: "error",
        //   duration: 3000,
        //   isClosable: true,
        // });
        // Handle additional logic for 401 errors, like redirecting to a login page
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log("Error", error.message);
      }
      // Throw the error to be caught by the catch block
      return Promise.reject(error);
    }
  );

  try {
    const options = {
      method,
      url,
      data: body ? body : null,
    };
    const response = await axiosInstance(options);
    return response?.data;
  } catch (error) {
    throw error; // Re-throw the error for further handling up the call stack
  }
};

export default fetchingData;
