/* eslint-disable no-unused-vars */
import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { getCookie } from "cookies-next";

const withAuth = (WrappedComponent) => {
  const WithAuth = (props) => {
    const router = useRouter();

    useEffect(() => {
      const token = getCookie("token");
      if (!token) {
        router.push("/login");
      }
    }, [router]);

    return <WrappedComponent {...props} />;
  };

  return WithAuth;
};

export default withAuth;
