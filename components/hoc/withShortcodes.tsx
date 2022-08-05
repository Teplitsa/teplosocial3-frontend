import { render } from "react-dom";
import {
  FunctionComponent,
  ForwardRefExoticComponent,
  RefAttributes,
  useEffect,
  createRef,
  useState,
} from "react";
import InclusiveComponents from "../../inclusive-components/inclusive-components";
import { convertObjectToClassName } from "../../utilities/utilities";
import styles from "../../inclusive-components/tooltip/Tooltip.module.scss";

const { Button, Tooltip } = InclusiveComponents;

const withShortcodes = ({
  Content,
}: {
  Content: ForwardRefExoticComponent<RefAttributes<HTMLTemplateElement>>;
}): FunctionComponent => {
  const [isShortcodesRendered, setIsShortcodesRendered] =
    useState<boolean>(false);
  const contentRef = createRef<HTMLTemplateElement>();

  useEffect(() => {
    const content = contentRef.current?.content;

    if (!content || isShortcodesRendered) return;

    const newContent = content.cloneNode(true) as HTMLElement;

    const tooltips = newContent.querySelectorAll("tooltip");

    if (tooltips.length > 0) {
      tooltips.forEach((tooltip) => {
        const shortcodeContainer = document.createElement("div");
        const tooltipAnchor =
          tooltip.querySelector("tooltip-anchor").textContent;
        const tooltipContent =
          tooltip.querySelector("tooltip-content").innerHTML;

        shortcodeContainer.classList.add(styles["tooltip-shortcode-wrapper"]);

        tooltip.replaceWith(shortcodeContainer);

        render(
          <Tooltip
            content={() => (
              <span dangerouslySetInnerHTML={{ __html: tooltipContent }} />
            )}
          >
            <Button
              className={convertObjectToClassName({
                btn_reset: true,
                [styles["tooltip__link"]]: true,
              })}
            >
              {tooltipAnchor}
            </Button>
          </Tooltip>,
          shortcodeContainer
        );
      });
    }

    contentRef.current.parentNode.insertBefore(newContent, contentRef.current);

    setIsShortcodesRendered(true);
  }, [contentRef, isShortcodesRendered]);

  return () => <Content ref={contentRef} />;
};

export default withShortcodes;
