import { ReactElement, useState } from "react";
import {
  useStoreActions,
  useStoreState,
} from "../../../../model/helpers/hooks";
import useIsomorphicLayoutEffect from "../../../../custom-hooks/use-isomorphic-layout-effect";

import InclusiveComponents from "../../../../inclusive-components/inclusive-components";

import { IMatrixDefinition } from "../../../../inclusive-components/inclusive-components.typing";

import styles from "./AnswerMatrix.module.scss";

const { Matrix } = InclusiveComponents;

const randomizeAnswers = (
  answers: Array<{ datapos: string; sortString: string }>
): Array<IMatrixDefinition> => {
  let randomizedIndexes: Array<number> = [];

  while (randomizedIndexes.length < answers.length) {
    const index = Math.floor(Math.random() * answers.length);

    randomizedIndexes = Array.from(new Set([...randomizedIndexes, index]));
  }

  const questionAnswerData = answers
    .map(({ datapos, sortString }) => ({
      slug: datapos,
      text: sortString,
    }))
    .reduce(
      (
        randomizedIndexes: Array<number | IMatrixDefinition>,
        answer: { slug: string; text: string },
        i: number
      ) => {
        const index = randomizedIndexes.findIndex((item) => item === i);

        randomizedIndexes[index] = answer;

        return [...randomizedIndexes];
      },
      randomizedIndexes
    );

  return questionAnswerData as Array<IMatrixDefinition>;
};

const AnswerMatrix: React.FunctionComponent = (): ReactElement => {
  const question = useStoreState(
    (state) => state.components.blockPage.quiz.activeQuestion
  );
  const setUserAnswerMatrix = useStoreActions(
    (actions) => actions.components.blockPage.quiz.setUserAnswerMatrix
  );
  const [definitions, setDefinitions] = useState<Array<IMatrixDefinition>>([]);

  const handleMatrixCallback = (answerValue: Array<string>) => {
    setUserAnswerMatrix({ questionId: question.id, answerValue });
  };

  useIsomorphicLayoutEffect(() => {
    setDefinitions(randomizeAnswers(question.answerData))
  }, [question])

  return (
    <div className={styles["answers"]}>
      <Matrix
        terms={question.answerData.map(({ answer }) => ({
          text: answer,
        }))}
        definitions={definitions}
        callbackFn={handleMatrixCallback}
      />
    </div>
  );
};

export default AnswerMatrix;
