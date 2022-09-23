import {
  ReactElement,
  useState,
  Dispatch,
  SetStateAction,
  useEffect,
} from "react";
import * as _ from "lodash";
import {
  useStoreActions,
  useStoreState,
} from "../../../../model/helpers/hooks";
import { IAnswerState } from "../../../../model/model.typing";
import { convertObjectToClassName } from "../../../../utilities/utilities";
import useIsomorphicLayoutEffect from "../../../../custom-hooks/use-isomorphic-layout-effect";

import InclusiveComponents from "../../../../inclusive-components/inclusive-components";

import styles from "./AnswerChoice.module.scss";

const { InputRadio } = InclusiveComponents;

interface IAnswerMultipleProps {
  style?: "borderedBox" | "fullfilledBox";
  onAfterChange?: (args: {
    setErrorIndexes: Dispatch<SetStateAction<Array<number>>>;
    selectedIndexes: Array<number>;
  }) => void;
}

const AnswerSingle: React.FunctionComponent<IAnswerMultipleProps> = ({
  style = "borderedBox",
  onAfterChange,
}): ReactElement => {
  const [selectedIndexes, setSelectedIndexes] = useState<Array<number>>([]);
  const [errorIndexes, setErrorIndexes] = useState<Array<number>>([]);
  const question = useStoreState(
    (state) => state.components.blockPage.quiz.activeQuestion
  );
  const userAnswers = useStoreState(
    (state) => state.components.blockPage.quiz.userAnswers
  );
  const setUserAnswer = useStoreActions(
    (actions) => actions.components.blockPage.quiz.setUserAnswer
  );

  useIsomorphicLayoutEffect(() => {
    const activeAnswers: Array<string> = _.get(userAnswers, question.id, []);
    const activeAnswerIndexes = question.answerData.reduce(
      (
        activeAnswerIndexes: Array<number>,
        { answer }: IAnswerState,
        i: number
      ) => {
        if (activeAnswers.includes(answer)) {
          activeAnswerIndexes.push(i);
        }

        return activeAnswerIndexes;
      },
      []
    );

    setSelectedIndexes(activeAnswerIndexes);
  }, [userAnswers, question]);

  useEffect(() => {
    onAfterChange && onAfterChange({ setErrorIndexes, selectedIndexes });
  }, [selectedIndexes]);

  return (
    <>
      {question.answerData.map((answer: IAnswerState, i: number) => {
        const isSelected = selectedIndexes.includes(i);
        const isError = errorIndexes.includes(i);

        return (
          <div
            key={`InputRadio-${question.id}-Answer${answer.answer}`}
            className={convertObjectToClassName({
              [styles.choiceOptionHavingError]: isError,
              [styles.choiceOptionSelected]:
                !isError && isSelected && style === "borderedBox",
              [styles.choiceOptionSelected_fullfilled]:
                !isError && isSelected && style === "fullfilledBox",
              [styles.choiceOption]: !isError && !isSelected,
            })}
          >
            <InputRadio
              label={answer.answer}
              name={`question_${question.id}`}
              value={answer.answer}
              checked={isSelected}
              onChange={() => {
                setUserAnswer({
                  questionId: question.id,
                  answerValue: answer.answer,
                });
              }}
            />
          </div>
        );
      })}
    </>
  );
};

export default AnswerSingle;
