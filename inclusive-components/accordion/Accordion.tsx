import {
  ReactElement,
  Children,
  cloneElement,
  useState,
  useRef,
  MouseEvent,
} from "react";
import useIsomorphicLayoutEffect from "../../custom-hooks/use-isomorphic-layout-effect";
import {
  convertObjectToClassName,
  convertClassNameToObject,
} from "../../utilities/utilities";
import { IAccordionProps } from "../inclusive-components.typing";
import defaultStyles from "./Accordion.module.scss";
import arrowControlStyles from "./Accordion.ArrowControlTheme.module.scss";
import { clearTimeout } from "timers";

type AccordionItemComponents = "title" | "content" | "control";

const styleCollection = {
  default: defaultStyles,
  "arrow-control": arrowControlStyles,
};

const accordionItemComponentList: Array<AccordionItemComponents> = [
  "title",
  "content",
  "control",
];

const Accordion: React.FunctionComponent<IAccordionProps> = ({
  theme = "default",
  initIndex = -1,
  children,
}): ReactElement => {
  const styles = styleCollection[theme];
  const accordionRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState<number>(initIndex);
  const [isInitiated, setIsInitiated] = useState<boolean>(false);

  const handleItemControlClickFactory =
    (itemIndex: number) => (event: MouseEvent<HTMLElement>) => {
      event.preventDefault();
      setActiveIndex((prevItemIindex) => {
        const currentItemIndex = prevItemIindex === itemIndex ? -1 : itemIndex;

        return currentItemIndex;
      });
    };

  useIsomorphicLayoutEffect(() => {
    const itemBlocks = accordionRef.current.querySelectorAll<HTMLElement>(
      ":scope > [class*=accordion__item]"
    );

    // itemBlocks.forEach((itemBlock: HTMLElement, i) => {
    //   itemBlock.addEventListener("transitionend", (event: TransitionEvent) => {
    //     if (event.target !== itemBlock || event.propertyName !== "height")
    //       return;

    //     const itemTitleBlockHeight =
    //       (event.target as HTMLElement).querySelector<HTMLElement>(
    //         "[class*=accordion__title]"
    //       )?.dataset.height ?? "auto";

    //       // console.log((event.target as HTMLElement).style.height, itemTitleBlockHeight)

    //     if (
    //       (event.target as HTMLElement).style.height !== itemTitleBlockHeight
    //     ) {
    //       (event.target as HTMLElement).style.height = "auto";
    //     }
    //   });
    // });

    const itemTitleBlocks = accordionRef.current.querySelectorAll(
      ":scope > [class*=accordion__item] > [class*=accordion__title]"
    );

    itemTitleBlocks.forEach((itemTitleBlock: HTMLElement) => {
      const { height } = itemTitleBlock.getBoundingClientRect();

      itemTitleBlock.dataset.height = `${height}px`;
    });
  }, []);

  useIsomorphicLayoutEffect(() => {
    let timerId: number;
    const itemBlocks = accordionRef.current.querySelectorAll<HTMLElement>(
      ":scope > [class*=accordion__item]"
    );

    itemBlocks.forEach((itemBlock: HTMLElement, i) => {
      const itemTitleBlockHeight =
        itemBlock.querySelector<HTMLElement>("[class*=accordion__title]")
          ?.dataset.height ?? "auto";

      if (activeIndex === -1 || activeIndex !== i) {
        itemBlock.classList.remove("expanded");

        if (itemBlock.style.height === "auto") {
          itemBlock.style.height = `${itemBlock.scrollHeight}px`;
          window.getComputedStyle(itemBlock, null).getPropertyValue("height");
        }

        itemBlock.style.height = itemTitleBlockHeight;
      } else {
        itemBlock.classList.add("expanded");

        if (!isInitiated && initIndex !== -1) {
          itemBlock.style.height = "auto";

          setIsInitiated(true);
        } else {
          itemBlock.style.height = `${itemBlock.scrollHeight}px`;
          timerId = window?.setTimeout(
            () => (itemBlock.style.height = "auto"),
            300
          );
        }
      }
    });

    return () => window?.clearTimeout(timerId);
  }, [activeIndex]);

  return (
    <div className={styles["accordion"]} ref={accordionRef}>
      {Children.toArray(children).map((item: ReactElement, itemIndex) => {
        const itemComponentsFound: Array<AccordionItemComponents> = [];

        const itemComponents = Children.toArray(item.props.children).map(
          (itemComponent: ReactElement) => {
            if (
              itemComponent.props &&
              itemComponent.props["data-accordion-title"]
            ) {
              itemComponentsFound.push("title");

              const itemComponentChildren = Children.toArray(
                itemComponent.props.children
              ).map((itemComponentChild: ReactElement) => {
                if (
                  itemComponentChild.props &&
                  itemComponentChild.props["data-accordion-control"]
                ) {
                  itemComponentsFound.push("control");

                  return cloneElement(
                    itemComponentChild,
                    {
                      "data-accordion-control": null,
                      className: convertObjectToClassName({
                        ...convertClassNameToObject(
                          itemComponentChild.props.className
                        ),
                        [styles["accordion__control"]]: true,
                        [styles["accordion__control_active"]]:
                          activeIndex === itemIndex,
                      }),
                      "aria-expanded": activeIndex === itemIndex,
                    },
                    [
                      ...Children.toArray(
                        itemComponentChild.props.children
                      ).map((child: string | ReactElement) => {
                        return typeof child === "string" ? (
                          <span
                            key={`AccordionControlText`}
                            className={styles["accordion__control-text"]}
                          >
                            {child}
                          </span>
                        ) : (
                          child
                        );
                      }),
                    ]
                  );
                }

                return itemComponentChild;
              });

              return cloneElement(itemComponent, {
                "data-accordion-title": null,
                className: convertObjectToClassName({
                  ...convertClassNameToObject(itemComponent.props.className),
                  [styles["accordion__title"]]: true,
                  [styles["accordion__title_active"]]:
                    activeIndex === itemIndex,
                }),
                onClick: handleItemControlClickFactory(itemIndex),
                children: itemComponentChildren,
              });
            }

            if (
              itemComponent.props &&
              itemComponent.props["data-accordion-content"]
            ) {
              itemComponentsFound.push("content");

              return cloneElement(itemComponent, {
                "data-accordion-content": null,
                "aria-hidden": activeIndex !== itemIndex,
                className: convertObjectToClassName({
                  ...convertClassNameToObject(itemComponent.props.className),
                  [styles["accordion__content"]]: true,
                  [styles["accordion__content_active"]]:
                    activeIndex === itemIndex,
                }),
              });
            }

            console.error("Accordion error: ignore unknown item component.");

            return null;
          }
        );

        const itemComponentsNotFound = accordionItemComponentList.filter(
          (componentName) => !itemComponentsFound.includes(componentName)
        );

        if (itemComponentsNotFound.length > 0) {
          console.error(
            `Accordion error. Components are not found: ${itemComponentsNotFound.join(
              ", "
            )}.`
          );

          return null;
        }

        return cloneElement(item, {
          className: convertObjectToClassName({
            ...convertClassNameToObject(item.props.className),
            [styles["accordion__item"]]: true,
            [styles["accordion__item_active"]]: activeIndex === itemIndex,
          }),
          children: itemComponents,
        });
      })}
    </div>
  );
};

export default Accordion;
