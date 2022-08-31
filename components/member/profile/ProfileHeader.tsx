import { ReactElement } from "react";
import * as _ from "lodash";
import Link from "next/link";

import { IProfileState, IUserState } from "../../../model/model.typing";

import * as profileUtils from "../../../model/member/profile-model";

import styles from "./ProfileHeader.module.scss";

import imageFb from "../../../assets/img/social-fb-white.svg";
import imageVk from "../../../assets/img/social-vk-white.svg";
import imageTg from "../../../assets/img/social-tg-white.svg";

const ProfileHeader: React.FunctionComponent<{
  profile: IProfileState;
}> = ({ profile }): ReactElement => {
  const socialLinksIcons = {
    facebook: { image: imageFb, title: "Facebook" },
    vk: { image: imageVk, title: "ВКонтакте" },
    telegram: { image: imageTg, title: "Телеграм" },
  };

  // console.log("profile:", profile);
  const socialLinksToDisplay = profile.socialLinks.filter((link) => {
    return !link.mustHide && !!_.get(socialLinksIcons, link.type, null);
  });

  return (
    <div className={styles.header}>
      {!!profile.avatar && (
        <div className={styles.avatar}>
          <img
            src={profile.avatar}
            alt={`Фото профиля ${profileUtils.getFullName(
              profile as IUserState
            )}!`}
          />
        </div>
      )}

      <div className={styles.name}>
        <h1>{profileUtils.getFullName(profile as IUserState)}</h1>
      </div>

      {!!_.trim(profile.city) && (
        <div className={styles.city}>
          <h3>{profile.city}</h3>
        </div>
      )}

      {socialLinksToDisplay.length > 0 && (
        <div className={styles.socialLinks}>
          {socialLinksToDisplay.map((link) => {
            const social = _.get(socialLinksIcons, link.type, null);

            if (social === null) {
              return null;
            }

            return (
              <Link href={`https://t.me/${link.url.slice(1)}`}>
                <a target="_blank">
                  <img src={social.image} alt={social.title} />
                </a>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ProfileHeader;
