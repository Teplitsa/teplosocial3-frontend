import { ReactElement, useContext } from "react";
import { useRouter } from "next/router";
import { useStoreState } from "../../../model/helpers/hooks";
import { convertObjectToClassName } from "../../../utilities/utilities";
import InclusiveComponents from "../../../inclusive-components/inclusive-components";
import styles from "./HomeHero.module.scss";

const { Button, ModalContext } = InclusiveComponents;

const HomeHeroPromoVideo: React.FunctionComponent = (): ReactElement => {
  return (
    <div className={styles["home-hero__promo-video"]}>
      <iframe
        width="auto"
        height="auto"
        src="https://www.youtube.com/embed/XOLZpSKu_wM"
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
    </div>
  );
};

const HomeHero: React.FunctionComponent = (): ReactElement => {
  const router = useRouter();
  const { dispatch: modalDispatch } = useContext(ModalContext);
  const isLoggedIn = useStoreState((state) => state.session.isLoggedIn);

  const handleRegisterButtonClick = () => {
    router.push("/auth/registration");
  };

  const handlePromoButtonClick = () => {
    modalDispatch({
      type: "template",
      payload: {
        isTransparent: true,
        backdrop: "dark",
        size: "auto",
        invisibleTitle: true,
        title: "Видеопрезентация платформы «Теплица.Курсы»",
        content: HomeHeroPromoVideo,
      },
    });

    modalDispatch({ type: "open" });
  };

  return (
    <section className={styles["home-hero"]}>
      <div className={styles["home-hero__inner"]}>
        <h1 className={styles["home-hero__title"]}>
          Помогаем активистам и сотрудникам
          <br />
          НКО развиваться и получать знания
        </h1>
        <div
          className={convertObjectToClassName({
            [styles["home-hero__footer"]]: true,
            [styles["home-hero__footer_logged-in"]]: isLoggedIn,
          })}
        >
          {!isLoggedIn && (
            <Button
              className={convertObjectToClassName({
                btn_primary: true,
                "btn_full-width": true,
                [styles["home-hero__cta"]]: true,
              })}
              role="link"
              onClick={handleRegisterButtonClick}
            >
              Зарегистрироваться
            </Button>
          )}
          <Button
            className={convertObjectToClassName({
              btn_reset: true,
              [styles["home-hero__promo"]]: true,
            })}
            onClick={handlePromoButtonClick}
          >
            Видео о платформе
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HomeHero;
