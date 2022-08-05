import { ReactElement } from "react";
import { useStoreState } from "../../../model/helpers/hooks";
import HomeAdvantagesItem from "./HomeAdvantagesItem";
import styles from "./HomeAdvantages.module.scss";

const HomeAdvantages: React.FunctionComponent = (): ReactElement => {
  const advantages = useStoreState(
    (state) => state.components.homePage.advantages
  );

  return (
    <section className={styles["home-advantages"]}>
      <div className={styles["home-advantages__inner"]}>
        <h2 className={styles["home-advantages__title"]}>
          Мы поддержим вас на всем пути обучения
        </h2>
        <ul className={styles["home-advantages__list"]}>
          {advantages.map(({ _id, title, excerpt: text, thumbnail: media }) => (
            <li
              key={`HomeAdvantagesItem-${_id}`}
              className={styles["home-advantages__item"]}
            >
              <HomeAdvantagesItem
                {...{
                  media,
                  title,
                  text,
                }}
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default HomeAdvantages;
