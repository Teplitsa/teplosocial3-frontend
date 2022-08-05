import { ReactElement, useEffect } from "react";
import { useRouter } from "next/router";
import { GetServerSideProps } from "next";
import { useStoreState } from "../../model/helpers/hooks";
import DocumentHead from "../../components/DocumentHead";
import Main from "../../components/layout/Main";
import Login from "../../components/page/auth/login/Login";

const LoginPage: React.FunctionComponent = (): ReactElement => {
  const router = useRouter();
  const isLoggedIn = useStoreState((store) => store.session.isLoggedIn);

  useEffect(() => {
    if (isLoggedIn) {
      router.push("/");
    }
  }, [isLoggedIn]);

  return (
    <>
      <DocumentHead />
      <Main>
        <Login />
      </Main>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  const model = {
    app: {},
    page: {
      title: { rendered: "Вход в систему" },
    },
  };

  return {
    props: { ...model },
  };
};

export default LoginPage;
