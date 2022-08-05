import { ReactElement, createElement } from "react";
import { Parser } from "html-to-react";
import { ICoreHeadingBlock } from "../../model/gutenberg/gutenberg.typing";

const CoreHeadingBlock: React.FunctionComponent<ICoreHeadingBlock> = ({
  innerContent,
}): ReactElement => {
    
  const htmlToReactParser = new Parser();
  const blockContentComponent = htmlToReactParser.parse(innerContent);

  return blockContentComponent;
};

export default CoreHeadingBlock;
