import { action, thunk } from "easy-peasy";
import {
  ICatalogPageState,
  ICatalogPageModel,
  ICatalogPageActions,
  ICatalogPageThunks,
  IStoreModel,
} from "../../model.typing";
import { pageState, pageThunks } from "../../page-model";
import { COURSES_PER_PAGE } from "../../../const";

const catalogPageState: ICatalogPageState = {
  ...pageState,
  courseFilter: {
    searchPhrase: "",
    tags: [],
    activeTags: [],
    searchTooltips: {
      courses: null,
      tracks: null,
    },
  },
  courses: null,
  tracks: null,
  courseTotal: 0,
  trackTotal: 0,
  courseSkip: 0,
  trackSkip: 0,
  isCourseListLoading: false,
  isTrackListLoading: false,
};

const catalogPageActions: ICatalogPageActions = {
  initializeState: action((prevState) => {
    Object.assign(prevState, catalogPageState);
  }),
  setState: action((prevState, newState) => {
    Object.assign(prevState, newState);
  }),
  setCourseList: action((prevState, courseList) => {
    prevState.courses = courseList;
  }),
  setTrackList: action((prevState, trackList) => {
    prevState.tracks = trackList;
  }),
  updateCourseList: action((prevState, courseList) => {
    prevState.courses = [...(prevState.courses ?? []), ...courseList];
  }),
  updateTrackList: action((prevState, trackList) => {
    prevState.tracks = [...(prevState.tracks ?? []), ...trackList];
  }),
  setSearchPhrase: action((prevState, newSearchPhrase) => {
    prevState.courseFilter.searchPhrase = newSearchPhrase;
  }),
  setSearchTooltipsForCourse: action((prevState, newCourseTooltips) => {
    prevState.courseFilter.searchTooltips.courses = newCourseTooltips;
  }),
  setSearchTooltipsForTrack: action((prevState, newTrackTooltips) => {
    prevState.courseFilter.searchTooltips.tracks = newTrackTooltips;
  }),
  setActiveTags: action((prevState, newTagId) => {
    if (prevState.courseFilter.activeTags.includes(newTagId)) {
      prevState.courseFilter.activeTags =
        prevState.courseFilter.activeTags.filter(
          (tagSlug) => tagSlug !== newTagId
        );
    } else {
      prevState.courseFilter.activeTags = [
        ...prevState.courseFilter.activeTags,
        newTagId,
      ];
    }
  }),
  setCourseTotal: action((prevState, courseTotal) => {
    prevState.courseTotal = courseTotal;
  }),
  setTrackTotal: action((prevState, trackTotal) => {
    prevState.trackTotal = trackTotal;
  }),
  setCourseSkip: action((prevState, courseSkip) => {
    prevState.courseSkip = courseSkip;
  }),
  setTrackSkip: action((prevState, trackSkip) => {
    prevState.trackSkip = trackSkip;
  }),
  setCourseListLoading: action((prevState, isLoading) => {
    prevState.isCourseListLoading = isLoading;
  }),
  setTrackListLoading: action((prevState, isLoading) => {
    prevState.isTrackListLoading = isLoading;
  }),
};

const catalogPageThunks: ICatalogPageThunks = {
  ...pageThunks,
  courseListRequest: thunk(
    async (
      { setCourseList, updateCourseList, setCourseTotal },
      { callback },
      { getStoreState }
    ) => {
      const {
        session: {
          token: { authToken },
        },
        components: {
          catalogPage: {
            courseFilter: { searchPhrase, activeTags },
            courseSkip,
          },
        },
      } = getStoreState() as IStoreModel;

      try {
        const requestUrl = new URL(
          `${process.env.BaseUrl}/api/v1/cache/courses`
        );

        const courseListArgs = {
          limit: String(COURSES_PER_PAGE),
          skip: String(courseSkip),
        };

        if (activeTags.length > 0) {
          courseListArgs["filter[tag_id]"] = activeTags.join(",");
        }

        if (searchPhrase.length > 0) {
          courseListArgs["s"] = searchPhrase;
        }

        requestUrl.search = new URLSearchParams(courseListArgs).toString();

        const response = await fetch(requestUrl.toString(), {
          headers: {
            "X-Auth-Token": String(authToken),
          },
        });
        const { courses, total } = await response.json();

        if (courseSkip) {
          updateCourseList(courses ?? []);
        } else {
          setCourseList(courses ?? []);
        }

        setCourseTotal(total);

        callback && callback();
      } catch (error) {
        console.error(error);
      }
    }
  ),
  trackListRequest: thunk(
    async (
      { setTrackList, updateTrackList, setTrackTotal },
      { callback },
      { getStoreState }
    ) => {
      const {
        session: {
          token: { authToken },
        },
        components: {
          catalogPage: {
            courseFilter: { searchPhrase, activeTags },
            trackSkip,
          },
        },
      } = getStoreState() as IStoreModel;

      try {
        const requestUrl = new URL(
          `${process.env.BaseUrl}/api/v1/cache/tracks`
        );

        const trackListArgs = {
          limit: String(COURSES_PER_PAGE),
          skip: String(trackSkip),
        };

        if (activeTags.length > 0) {
          trackListArgs["filter[tag_id]"] = activeTags.join(",");
        }

        if (searchPhrase.length > 0) {
          trackListArgs["s"] = searchPhrase;
        }

        requestUrl.search = new URLSearchParams(trackListArgs).toString();

        const response = await fetch(requestUrl.toString(), {
          headers: {
            "X-Auth-Token": String(authToken),
          },
        });
        const { tracks, total } = await response.json();

        if (trackSkip) {
          updateTrackList(tracks ?? []);
        } else {
          setTrackList(tracks ?? []);
        }

        setTrackTotal(total);

        callback && callback();
      } catch (error) {
        console.error(error);
      }
    }
  ),
  courseTooltipstRequest: thunk(
    async ({ setSearchTooltipsForCourse }, payload, { getStoreState }) => {
      const {
        session: {
          token: { authToken },
        },
        components: {
          catalogPage: {
            courseFilter: { searchPhrase, activeTags },
          },
        },
      } = getStoreState() as IStoreModel;

      if (searchPhrase.length === 0) {
        setSearchTooltipsForCourse(null);

        return;
      }

      try {
        const requestUrl = new URL(
          `${process.env.BaseUrl}/api/v1/cache/courses`
        );

        const courseListArgs = {
          limit: String(COURSES_PER_PAGE),
          s: searchPhrase,
          search_mode: "exact",
        };

        if (activeTags.length > 0) {
          courseListArgs["filter[tag_id]"] = activeTags.join(",");
        }

        requestUrl.search = new URLSearchParams(courseListArgs).toString();

        const response = await fetch(requestUrl.toString(), {
          headers: {
            "X-Auth-Token": String(authToken),
          },
        });
        const { courses } = await response.json();

        setSearchTooltipsForCourse(courses);
      } catch (error) {
        console.error(error);
      }
    }
  ),
  trackTooltipstRequest: thunk(
    async ({ setSearchTooltipsForTrack }, payload, { getStoreState }) => {
      const {
        session: {
          token: { authToken },
        },
        components: {
          catalogPage: {
            courseFilter: { searchPhrase, activeTags },
          },
        },
      } = getStoreState() as IStoreModel;

      if (searchPhrase.length === 0) {
        setSearchTooltipsForTrack(null);

        return;
      }

      try {
        const requestUrl = new URL(
          `${process.env.BaseUrl}/api/v1/cache/tracks`
        );

        const trackListArgs = {
          limit: String(COURSES_PER_PAGE),
          s: searchPhrase,
          search_mode: "exact",
        };

        if (activeTags.length > 0) {
          trackListArgs["filter[tag_id]"] = activeTags.join(",");
        }

        requestUrl.search = new URLSearchParams(trackListArgs).toString();

        const response = await fetch(requestUrl.toString(), {
          headers: {
            "X-Auth-Token": String(authToken),
          },
        });
        const { tracks } = await response.json();

        setSearchTooltipsForTrack(tracks);
      } catch (error) {
        console.error(error);
      }
    }
  ),
};

const catalogPageModel: ICatalogPageModel = {
  ...catalogPageState,
  ...catalogPageActions,
  ...catalogPageThunks,
};

export default catalogPageModel;
