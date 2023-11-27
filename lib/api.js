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
    config.headers['Content-Length'] = config.data ? JSON.stringify(config.data).length : 0;
    return config;
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
      if (error.response) {
        return error.response;
      } else if (error.request) {
        return error.request;
      } else {
        return error.message;
      }
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
