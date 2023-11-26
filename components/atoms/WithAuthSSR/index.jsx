// utils/withAuthServerSideProps.js
import { getCookie } from "cookies-next";

export const withAuthServerSideProps = (getServerSidePropsFunc) => {
  return async (context) => {
    const token = context.req.cookies.token;
    if (token && getServerSidePropsFunc) {
      const response = await getServerSidePropsFunc(context);
      if (response?.props.res?.message === "Authorization failed") {
        return {
          redirect: {
            destination: "/login",
            permanent: false,
          },
        };
      }

      return response;
    }

    // If no getServerSideProps function was provided, return an empty props object
    return { props: {} };
  };
};
