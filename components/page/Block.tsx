import { ReactElement, useEffect, Fragment, useState } from "react";
import * as _ from "lodash";
import { useStoreState } from "../../model/helpers/hooks";

import BlockHeader from "../learn/block/BlockHeader";
import BlockContent from "../learn/block/BlockContent";

const Block: React.FunctionComponent = (): ReactElement => {
  const course = useStoreState(state => state.components.blockPage.course);
  const block = useStoreState(state => state.components.blockPage.block);

  // console.log("block.isCompleted:", block.isCompleted);
  // console.log("block.contentType:", block.contentType);

  return (
    <>
      <BlockHeader course={course} />
      <BlockContent block={block} />
    </>
  );
};

export default Block;
