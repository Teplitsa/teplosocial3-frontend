import "../assets/sass/main.scss";
import { AppProps } from "next/app";
import { ReactElement, useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Store, createStore, StoreProvider as Provider } from "easy-peasy";
import * as _ from "lodash";
import storeModel from "../model/store-model";
import withSkeleton from "../components/hoc/withSkeleton";
import { requestTouchVisitorSession } from "../model/session-model";
import { loadCourseTags } from "../model/page-model";

export const store: Store = createStore(storeModel, {
  name: "TeploAppStore",
  devTools: true,
});

const TeploApp = ({ Component, pageProps }: AppProps): ReactElement => {
  const { dispatch } = store;
  const { statusCode, app, session, page, ...component } = pageProps;
  const [componentName] = Object.keys(component);

  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [Skeleton, setSkeleton] = useState(null);

  dispatch({
    type: "@action.app.setState",
    payload: {
      ...app,
      ...{
        componentsLoaded: {
          [componentName]: {
            at: new Date().toISOString(),
          },
        },
      },
    },
  });
  dispatch({
    type: `@action.page.setState`,
    payload: page,
  });
  dispatch({
    type: `@action.session.${session ? "setState" : "setStateGuest"}`,
    payload: session ?? null,
  });
  dispatch({
    type: `@action.components.${componentName}.setState`,
    payload: component[componentName],
  });

  useEffect(() => {
    const handleRouteChange = (url: string) => {
      if (isPageWithSkeleton(url)) {
        setIsLoading(true);
        setSkeleton(() => withSkeleton({ pathname: url }));
      }
    };

    const handleRouteChanged = (url: string) => {
      // reset breadcrumbs
      dispatch({
        type: `@action.components.breadCrumbs.initializeState`,
      });

      if (isPageWithSkeleton(url)) {
        setIsLoading(false);
      }

      // session tracking
      requestTouchVisitorSession();
    };

    router.events.on("routeChangeStart", handleRouteChange);
    router.events.on("routeChangeComplete", handleRouteChanged);

    return () => {
      router.events.off("routeChangeStart", handleRouteChange);
      router.events.off("routeChangeComplete", handleRouteChanged);
    };
  }, []);

  // session tracking
  useEffect(() => {
    requestTouchVisitorSession();
  }, []);

  useEffect(() => {
    console.log("[APP] loadCourseTags...");
    loadCourseTags((courseTags) => {
      dispatch({
        type: "@action.page.setCourseTags",
        payload: courseTags,
      });
    });
  }, []);

  return (
    <Provider store={store}>
      {(isLoading && !Object.is(Skeleton, null) && <Skeleton />) || (
        <Component {...component[componentName]} statusCode={statusCode} />
      )}
    </Provider>
  );
};

function isPageWithSkeleton(pathname) {
  // always use skeleton
  return (
    true ||
    pathname.search(/^\/$/i) !== -1 ||
    pathname.search(/^\/auth\/registration$/i) !== -1
  );
}

export default TeploApp;
