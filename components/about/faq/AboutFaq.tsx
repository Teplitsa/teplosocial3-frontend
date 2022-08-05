import { ReactElement } from "react";
import InclusiveComponents from "../../../inclusive-components/inclusive-components";
import { convertObjectToClassName } from "../../../utilities/utilities";
import data from "./faq-data.json";
import styles from "./AboutFaq.module.scss";

const { Accordion, Button } = InclusiveComponents;

const AboutFaq: React.FunctionComponent = (): ReactElement => {
  return (
    <section className={styles["about-faq"]}>
      <h2 className={styles["about-faq__title"]}>Популярные вопросы</h2>
      <div className={styles["about-catalog__accordion"]}>
        <Accordion>
          {data.faq.map(({ title, text }, i) => (
            <section key={`FaqItem-${i}`}>
              <h4 data-accordion-title={true}>
                <Button
                  className={convertObjectToClassName({
                    ["btn_reset"]: true,
                    [styles["about-faq__item-title"]]: true,
                  })}
                  data-accordion-control={true}
                >
                  {title}
                </Button>
              </h4>
              <div
                className={styles["about-faq__item-text"]}
                data-accordion-content={true}
                dangerouslySetInnerHTML={{ __html: text }}
              />
            </section>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default AboutFaq;
