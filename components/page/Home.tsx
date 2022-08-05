import { ReactElement } from "react";

import HomeHero from "../home/hero/HomeHero";
import HomeAdvantages from "../home/advantages/HomeAdvantages";
import HomeCourseFilter from "../home/course-filter/HomeCourseFilter";
import HomeCourses from "../home/courses/HomeCourses";
import HomeTracks from "../home/tracks/HomeTracks";
import HomeStats from "../home/stats/HomeStats";
import HomeTestimonials from "../home/testimonials/HomeTestimonials";
import HomeFounder from "../home/founder/HomeFounder";

import styles from "./Home.module.scss";

const Home: React.FunctionComponent = (): ReactElement => {
  return (
    <main className={styles["home"]}>
      <HomeHero />
      <HomeCourseFilter />
      <HomeStats />
      <HomeCourses />
      <HomeTracks />
      <HomeAdvantages />
      <HomeTestimonials />
      <HomeFounder />
    </main>
  );
};

export default Home;
