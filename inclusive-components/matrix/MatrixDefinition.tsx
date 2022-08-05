import {
  ReactElement,
  DragEvent,
  TouchEvent,
  MouseEvent,
  AnimationEvent,
  useState,
  useEffect,
  useRef,
} from "react";
import useTouchable from "../../custom-hooks/use-touchable";
import { IMatrixDefinition } from "../inclusive-components.typing";
import { convertObjectToClassName } from "../../utilities/utilities";
import styles from "./Matrix.module.scss";

const MatrixDefinition: React.FunctionComponent<IMatrixDefinition> = ({
  order,
  text,
  slug,
  activeSlug,
  initialized,
  setSlugs,
  setActiveSlug,
}): ReactElement => {
  const isTouchable = useTouchable();
  const dragImageRef = useRef<HTMLElement>(null);
  const definitionRef = useRef<HTMLDivElement>(null);
  const orderRef = useRef<number>(order);
  const [isDragged, setIsDragged] = useState<boolean>(false);
  const [correction, setCorrection] = useState<number>(0);
  const [definitionTop, setDefinitionTop] = useState<number>(0);
  const [neighbourElementSlug, setNeighbourElementSlug] = useState<string>();

  useEffect(() => {
    if (
      typeof neighbourElementSlug !== "undefined" &&
      neighbourElementSlug !== activeSlug
    ) {
      setSlugs((slugs) => {
        const slugIndex = slugs.findIndex(
          (item) => item === neighbourElementSlug
        );
        const currentSlugIndex = slugs.findIndex((item) => item === activeSlug);

        slugs[slugIndex] = activeSlug;
        slugs[currentSlugIndex] = neighbourElementSlug;

        return [...slugs];
      });
    }
  }, [neighbourElementSlug]);

  useEffect(() => {
    if (Object.is(dragImageRef.current, null)) return;

    const { top: dragImageTop, bottom: dragImageBottom } =
      dragImageRef?.current.getBoundingClientRect();

    if (dragImageTop < 0) {
      window.scrollBy(0, dragImageTop);
    } else if (dragImageBottom > window.innerHeight) {
      window.scrollBy(0, dragImageBottom - window.innerHeight);
    }
  }, [definitionTop]);

  useEffect(() => {
    if (initialized) {
      if (activeSlug !== slug && orderRef.current !== order) {
        const className =
          styles[
            `matrix-definition_animated-${
              orderRef.current < order ? "down" : "up"
            }`
          ];

        definitionRef.current.classList.add(className);
      }
    }

    orderRef.current = order;
  }, [order]);

  const handleDefinitionDragStart = (event: DragEvent) => {
    const definitionElement = event.currentTarget as HTMLElement;
    const dragImage = definitionElement.cloneNode(true) as HTMLElement;

    dragImage.classList.remove(styles["matrix-definition_selected"]);
    dragImage.classList.add(styles["matrix-definition_active"]);
    definitionElement.parentNode.appendChild(dragImage);
    event.dataTransfer.setDragImage(
      dragImage,
      definitionElement.offsetWidth / 2,
      definitionElement.offsetHeight / 2
    );

    definitionElement.classList.add(styles["matrix-definition_disabled"]);

    event.dataTransfer.effectAllowed = "move";

    definitionElement.setAttribute("aria-grabbed", "true");

    definitionElement.setAttribute("aria-dropeffect", "move");

    setActiveSlug(slug);
  };

  const handleDefinitionDragEnter = (event: DragEvent) => {
    if (isDragged) {
      return;
    }

    if (!["", activeSlug].includes(slug)) {
      setSlugs((slugs) => {
        const slugIndex = slugs.findIndex((item) => item === slug);
        const currentSlugIndex = slugs.findIndex((item) => item === activeSlug);

        slugs[slugIndex] = activeSlug;
        slugs[currentSlugIndex] = slug;

        return [...slugs];
      });

      setIsDragged(true);
    }
  };

  const handleDefinitionDrag = (event: DragEvent) => {
    event.currentTarget.parentNode.parentNode
      .querySelectorAll(`.${styles["matrix-definition_selected"]}`)
      .forEach((element) => {
        element.classList.remove(styles["matrix-definition_selected"]);
      });
  };

  const handleDefinitionDragEnd = (event: DragEvent) => {
    const definitionElement = event.currentTarget as HTMLElement;
    definitionElement.parentNode
      .querySelector(`.${styles["matrix-definition_active"]}`)
      .remove();
    definitionElement.classList.remove(styles["matrix-definition_disabled"]);
    definitionElement.classList.add(styles["matrix-definition_selected"]);

    definitionElement.setAttribute("aria-grabbed", "false");

    definitionElement.removeAttribute("aria-dropeffect");

    setActiveSlug("");
  };

  const handleDefinitionMouseEnter = (event: MouseEvent) => {
    event.currentTarget.classList.add(styles["matrix-definition_selected"]);
  };

  const handleDefinitionMouseLeave = (event: MouseEvent) => {
    event.currentTarget.classList.remove(styles["matrix-definition_selected"]);
  };

  const handleDefinitionTouchStart = (event: TouchEvent) => {
    const definitionElement = event.currentTarget as HTMLElement;
    const { top: definitionElementTop } =
      definitionElement.getBoundingClientRect();
    const dragImage = definitionElement.cloneNode(true) as HTMLElement;

    dragImage.classList.remove(styles["matrix-definition_selected"]);
    dragImage.classList.add(styles["matrix-definition_active"]);
    dragImage.style.top = `${definitionElementTop}px`;
    dragImage.style.height = `${definitionElement.offsetHeight}px`;
    dragImage.style.width = `${definitionElement.offsetWidth}px`;

    definitionElement.parentNode.appendChild(dragImage);

    definitionElement.classList.add(styles["matrix-definition_disabled"]);

    definitionElement.setAttribute("aria-grabbed", "true");

    definitionElement.setAttribute("aria-dropeffect", "move");

    document.body.style.overflowY = "hidden";

    setCorrection(event.changedTouches[0].clientY - definitionElementTop);

    setActiveSlug(slug);

    dragImageRef.current = dragImage;
  };

  const handleDefinitionTouchMove = (event: TouchEvent) => {
    const { clientY: touchClientY } = event.changedTouches[0];
    const dragImage = dragImageRef.current;
    const newTop = touchClientY - correction;

    const {
      top: dragImageTop,
      left: dragImageLeft,
      bottom: dragImageBottom,
    } = dragImage.getBoundingClientRect();
    const neighbourElement = document.elementFromPoint(
      dragImageLeft,
      definitionTop > newTop ? dragImageTop - 1 : dragImageBottom + 1
    ) as HTMLElement; // prevTop > newTop ? "up" : "down"

    const neighbourElementSlug = neighbourElement?.dataset.slug;

    if (
      !(
        neighbourElement?.classList.contains(
          styles["matrix-definition_animated-up"]
        ) ||
        neighbourElement?.classList.contains(
          styles["matrix-definition_animated-down"]
        )
      )
    ) {
      setNeighbourElementSlug(neighbourElementSlug);
    }

    setDefinitionTop(newTop);

    dragImage.style.top = `${definitionTop}px`;
  };

  const handleDefinitionTouchEnd = (event: TouchEvent) => {
    const definitionElement = event.currentTarget as HTMLElement;
    const dragImage = dragImageRef.current;

    definitionElement.classList.remove(styles["matrix-definition_disabled"]);

    definitionElement.setAttribute("aria-grabbed", "false");

    definitionElement.removeAttribute("aria-dropeffect");

    dragImage.style.top = "0";
    dragImage.remove();

    dragImageRef.current = null;

    document.body.style.overflowY = "auto";
  };

  const handleDefinitionAnimationEnd = (event: AnimationEvent) => {
    event.currentTarget.classList.remove(
      styles["matrix-definition_animated-up"]
    );
    event.currentTarget.classList.remove(
      styles["matrix-definition_animated-down"]
    );

    !isTouchable && setIsDragged(false);
  };

  const eventListeners = (isTouchable && {
    onTouchStart: handleDefinitionTouchStart,
    onTouchMove: handleDefinitionTouchMove,
    onTouchEnd: handleDefinitionTouchEnd,
    onTouchCancel: handleDefinitionTouchEnd,
    onAnimationEnd: handleDefinitionAnimationEnd,
  }) || {
    onMouseEnter: handleDefinitionMouseEnter,
    onMouseLeave: handleDefinitionMouseLeave,
    onDragStart: handleDefinitionDragStart,
    onDragEnd: handleDefinitionDragEnd,
    onDragEnter: handleDefinitionDragEnter,
    onDrag: handleDefinitionDrag,
    onAnimationEnd: handleDefinitionAnimationEnd,
  };

  return (
    <div style={{ order }} className={styles["matrix-definition-container"]}>
      <div
        ref={definitionRef}
        className={convertObjectToClassName({
          [styles["matrix-definition"]]: true,
          [styles["matrix-definition_touchable"]]: isTouchable,
        })}
        draggable={true}
        data-slug={slug}
        aria-grabbed={false}
        {...eventListeners}
      >
        {text}
      </div>
    </div>
  );
};

export default MatrixDefinition;
