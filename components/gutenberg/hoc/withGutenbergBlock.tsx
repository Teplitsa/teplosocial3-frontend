import { ReactElement, createElement } from "react";
import {
  CoreBlockTypes,
  ICoreHeadingBlock,
  ICoreParagraphBlock,
  ICoreImageBlock,
} from "../../../model/gutenberg/gutenberg.typing";
import CoreHeadingBlock from "../CoreHeadingBlock";
import CoreParagraphBlock from "../CoreParagraphBlock";
import CoreImageBlock from "../CoreImageBlock";

const blocks = {
  CoreHeadingBlock,
  CoreParagraphBlock,
  CoreImageBlock,
};

const withGutenbergBlock = ({
  elementName,
  props,
}: {
  elementName: CoreBlockTypes;
  props: any;
}): ReactElement => {
  return createElement<ICoreHeadingBlock | ICoreParagraphBlock | ICoreImageBlock>(
    blocks[elementName] || CoreParagraphBlock,
    props
  );
};

export default withGutenbergBlock;
