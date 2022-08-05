import { ReactElement, useEffect, Fragment, useState } from "react";
import * as _ from "lodash";
import { useStoreState } from "../../../model/helpers/hooks";

import ProfileHeader from "../../member/profile/ProfileHeader"
import ProfileDescription from "../../member/profile/ProfileDescription"
import ProfileActions from "../../member/profile/ProfileActions"

const Profile: React.FunctionComponent = (): ReactElement => {
  const profile = useStoreState(state => state.components.profilePage.profile);
  const session = useStoreState(state => state.session);

  // console.log("profile:", profile);

  if(!profile.id) {
    return null;
  }

  return (
    <>
      <ProfileHeader profile={profile} />
      <ProfileDescription profile={profile} />
      {session.user.id === profile.id &&
        <ProfileActions profile={profile} />
      }
    </>
  );
};

export default Profile;
