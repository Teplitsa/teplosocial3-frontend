import { ReactElement } from "react";
import { Parser } from "html-to-react";
import { ICoreParagraphBlock } from "../../model/gutenberg/gutenberg.typing";

const CoreParagraphBlock: React.FunctionComponent<ICoreParagraphBlock> = ({
  innerContent,
}): ReactElement => {

  const htmlToReactParser = new Parser();
  const blockContentComponent = htmlToReactParser.parse(innerContent);

  return blockContentComponent;
};

export default CoreParagraphBlock;
