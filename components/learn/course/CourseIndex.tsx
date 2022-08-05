import { ReactElement, useEffect, useState, MouseEvent } from "react";
import * as _ from "lodash";
import Link from "next/link";
import { useStoreState, useStoreActions } from "../../../model/helpers/hooks";

import {
  ICourseState, IModuleState, IBlockState,
} from "../../../model/model.typing";
import Loader from "../../Loader";
import ModuleIndexItem from "../module/ModuleIndexItem";

import styles from './CourseIndex.module.scss'

const CourseIndex: React.FunctionComponent<{
    course: ICourseState, 
    block: IBlockState, 
  }> = ({
    course, 
    block,
  }): ReactElement => {

  const requestCourseModules = useStoreActions(actions => actions.components.blockPage.requestCourseModules);
  const requestBlockSiblings = useStoreActions(actions => actions.components.blockPage.requestBlockSiblings);
  const siblingBlockList = useStoreState(state => state.components.blockPage.siblingBlockList);
  const courseModuleList = useStoreState(state => state.components.blockPage.courseModuleList); 
  const setModuleBlockList = useStoreActions(state => state.components.coursePage.setModuleBlockList);
  const [blockModule, setBlockModule] = useState(null)
  const isLoading = siblingBlockList === null || courseModuleList === null;

  useEffect(() => {
    requestCourseModules(course);
    requestBlockSiblings(block);
  }, []);

  useEffect(() => {
    if(courseModuleList === null || siblingBlockList === null) {
      return;
    }

    if(!block.moduleSlug) {
      return;
    }

    const blockModule = courseModuleList.find(module => module.slug === block.moduleSlug);
    // console.log("blockModule:", blockModule);

    if(blockModule) {
      setBlockModule(blockModule);
    }

  }, [siblingBlockList, courseModuleList]);

  useEffect(() => {
    if(siblingBlockList === null) {
      return;
    }
    
    setModuleBlockList({moduleId: blockModule ? blockModule.id : 0, blockList: siblingBlockList});
  }, [blockModule, siblingBlockList])

  if(isLoading) {
    return (
      <div className={styles.loading}>
        <Loader />
      </div>
    );
  }
  
  return (
    <div className={styles.container}>
      <div className={styles.containerInner}>
        {courseModuleList.map(module => <ModuleIndexItem 
          module={module} 
          isOpen={blockModule && module.slug === blockModule.slug} 
          key={`CourseIndex-ModuleIndexItem-${module.slug}`} 
        />)}
      </div>
    </div>
  );
};

export default CourseIndex;
