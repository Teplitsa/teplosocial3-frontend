import { ReactElement, useState, useEffect } from "react";
import useIsomorphicLayoutEffect from "../../custom-hooks/use-isomorphic-layout-effect";
import MatrixTerm from "./MatrixTerm";
import MatrixDefinition from "./MatrixDefinition";
import { IMatrixProps } from "../inclusive-components.typing";
import styles from "./Matrix.module.scss";

const Matrix: React.FunctionComponent<IMatrixProps> = ({
  terms,
  definitions,
  callbackFn,
}): ReactElement => {
  const [initialized, setInitialized] = useState<boolean>(false);
  const [slugs, setSlugs] = useState<Array<string>>([]);
  const [activeSlug, setActiveSlug] = useState<string>("");

  useIsomorphicLayoutEffect(() => {
    setSlugs(definitions.reduce((slugs, { slug }) => [...slugs, slug], []));
  }, [definitions]);

  useEffect(() => {
    setInitialized(activeSlug !== "");
  }, [activeSlug]);

  useEffect(() => {
    callbackFn && callbackFn(slugs);
  }, [slugs]);

  return (
    <div className={styles["matrix"]}>
      {terms.map((term, i) => (
        <MatrixTerm
          key={`MatrixTerm-${i}`}
          {...{ ...term, ...{ order: 2 * i + 1 } }}
        />
      ))}
      {definitions.map((definition, i) => (
        <MatrixDefinition
          key={`MatrixDefinition-${i}`}
          {...{
            ...definition,
            ...{
              order:
                2 * slugs.findIndex((slug) => slug === definition.slug) + 2,
            },
            activeSlug,
            initialized,
            setSlugs,
            setActiveSlug,
          }}
        />
      ))}
    </div>
  );
};

export default Matrix;
