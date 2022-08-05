import { ReactElement, useEffect } from "react";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useStoreState } from "../../model/helpers/hooks";
import DocumentHead from "../../components/DocumentHead";
import Main from "../../components/layout/Main";
import ChangePassword from "../../components/page/auth/change-password/ChangePassword";

const ForgotPasswordPage: React.FunctionComponent = (): ReactElement => {
  const router = useRouter();
  const isLoggedIn = useStoreState((store) => store.session.isLoggedIn);

  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/");
    }
  }, [isLoggedIn]);

  return (
    <>
      <DocumentHead />
      <Main>
        <ChangePassword />
      </Main>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  const model = {
    app: {},
    page: {
      title: { rendered: "Сменить пароль" },
    },
  };

  return {
    props: { ...model },
  };
};

export default ForgotPasswordPage;
