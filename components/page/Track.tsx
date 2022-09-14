import { ReactElement, useEffect, Fragment, useState } from "react";
import { useRouter } from "next/router";
import * as _ from "lodash";
import { useStoreState } from "../../model/helpers/hooks";

import TrackHeader from "../learn/track/TrackHeader";
import TrackContent from "../learn/track/TrackContent";

const Track: React.FunctionComponent = (): ReactElement => {
  const router = useRouter();
  const track = useStoreState((state) => state.components.trackPage.track);
  const [trackStartLoading, setTrackStartLoading] = useState(false);

  if (track === null) {
    return;
  }
  return (
    <>
      <TrackHeader
        {...{
          track,
          trackStartLoading,
          setTrackStartLoading,
          trackStartedCallback,
        }}
      />
      <TrackContent
        {...{
          track,
          trackStartLoading,
          setTrackStartLoading,
          trackStartedCallback,
        }}
      />
    </>
  );

  function trackStartedCallback(params) {
    if (params) {
      // router.push("/blocks/" + params.startBlockSlug);
      router.push("/adaptest-intro/" + params.startCourseSlug);
    } else {
      setTrackStartLoading(false);
    }
  }
};

export default Track;
