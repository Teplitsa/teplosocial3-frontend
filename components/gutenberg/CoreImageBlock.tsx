import { ReactElement } from "react";
import { Parser } from "html-to-react";
import { ICoreImageBlock } from "../../model/gutenberg/gutenberg.typing";

const CoreImageBlock: React.FunctionComponent<ICoreImageBlock> = ({
  innerContent,
}): ReactElement => {

  const htmlToReactParser = new Parser();
  const blockContentComponent = htmlToReactParser.parse(innerContent);

  return blockContentComponent;
};
export default CoreImageBlock;
