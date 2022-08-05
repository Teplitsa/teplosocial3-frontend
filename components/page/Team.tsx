import { ReactElement, useEffect, Fragment, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import * as _ from "lodash";

import * as utils from "../../utilities/utilities";
import { useStoreState } from "../../model/helpers/hooks";
import { regEvent } from "../../utilities/ga-events";
import { TeamMeberCard } from "../TeamMeberCard";
import BorderUnderHeader from "../common/BorderUnderHeader";
import InclusiveComponents from "../../inclusive-components/inclusive-components";
import useWindowDimensions from "../../hooks/windowDimensions";

import styles from './Team.module.scss'

const { Carousel } = InclusiveComponents;

const Team: React.FunctionComponent = (): ReactElement => {
  const router = useRouter();
  const { title, content, teamMembers } = useStoreState(state => state.components.teamPage);
  const { isLoggedIn } = useStoreState(state => state.session);
  const { width: windowWidth, height: windowHeight} = useWindowDimensions();

  return (
    <>
      <BorderUnderHeader />

      <section className={styles.teamDescription}>
        <h1>{title && utils.decodeHtmlEntities(title.rendered)}</h1>
        <p>{content && utils.decodeHtmlEntities(utils.stripTags(content.rendered))}</p>
      </section>

      {teamMembers && !_.isEmpty(teamMembers.items) &&
        <>
          <section className={styles.teamMembersCarousel}>
            <Carousel>
              <ul id="team-courses-list">
                {teamMembers.items.map(
                  (item) => (
                    <li key={item.id}>
                      <TeamMeberCard teamMember={item} />
                    </li>
                  )
                )}
              </ul>
            </Carousel>
          </section>

          <section className={styles.teamMembersTiles}>
            {teamMembers.items.map(
              (item) => (
                <TeamMeberCard teamMember={item} />
              )
            )}
          </section>
        </>
      }
    </>
  );
};

export default Team;
