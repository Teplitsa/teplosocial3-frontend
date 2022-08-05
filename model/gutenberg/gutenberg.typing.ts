import { ReactElement } from "react";

/**
 * Gutenberg
 */

export type CoreBlockTypes =
  | "CoreParagraphBlock"
  | "CoreHeadingBlock"
  | "ICoreImageBlock";

export interface ICoreBlock {
  __typename: CoreBlockTypes;
  blockName: string;
  attrs: any;
  innerBlocks: Array<ICoreBlock>;
  innerHTML: string;
  innerContent: string;
}

export interface ICoreHeadingBlock extends ICoreBlock {
}

export interface ICoreParagraphBlock extends ICoreBlock {
}

export interface ICoreImageBlock extends ICoreBlock {
  attributes: {
    id: number;
    sizeSlug: string;
  };
}
