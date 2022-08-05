import { ReactElement, Fragment } from "react";
import Link from "next/link";

import { useStoreState } from "../model/helpers/hooks";
import {
  ITeamMemberState
} from "../model/model.typing";

import styles from './TeamMemberCard.module.scss'

export const TeamMeberCard: React.FunctionComponent<{teamMember: ITeamMemberState}> = ({teamMember}): ReactElement => {
  return (
    <div className={styles.card}>
      <img src={teamMember.avatar} />
      <h2>{teamMember.title.rendered}</h2>
      <div dangerouslySetInnerHTML={{ __html: teamMember.content.rendered }} />
    </div>
  );
};
